import {usersRepository} from "../repositories/user.repository";
import {TypeRegisterUser} from "../types/user.register";
import {createPasswordHash} from "../utils/auth.util";
import ApiError from "../errors/ApiError";
import {
    USER_ALREADY_EXISTS,
    USER_ALREADY_VERIFIED,
    USER_BLOCKED,
    USER_NOT_FOUND, VERIFICATION_CODE_EXPIRED, VERIFICATION_CODE_MISMATCH, VERIFICATION_CODE_NOT_FOUND
} from "../utils/constants/error.masseges";
import {verificationCodesRepository} from "../repositories/verificationCode.repository";
import {createExpirationDate, createVerificationCode} from "../utils/create.verification-code";
import {sendOtpEmail} from "../utils/send.verification-code";
import {TypeVerifyUser} from "../types/verify.user";

const registerUser = async (data: TypeRegisterUser):Promise<void> => {
    const userDb = await usersRepository.getUserByEmail(data.email);

    if (userDb) {
        throw new ApiError(409, USER_ALREADY_EXISTS);
    }

    const createdUser = await usersRepository.createUser({
        email: data.email,
        password: await createPasswordHash(data.password),
        updatedAt: new Date(),
        createdAt: new Date()
    });

    const createdVerificationCode = await verificationCodesRepository.createVerificationCode({
        userId: createdUser.id,
        verificationCode: createVerificationCode(),
        expiredAt: createExpirationDate(new Date()),
        updatedAt: new Date(),
        createdAt: new Date()
    });

    await sendOtpEmail({
        email: createdUser.email,
        verificationCode: createdVerificationCode.verificationCode,
    });
}

const verifyUser = async (data: TypeVerifyUser):Promise<void> => {
    const userDb = await usersRepository.getUserByEmail(data.email);

    if (!userDb) {
        throw new ApiError(404, USER_NOT_FOUND);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, USER_BLOCKED);
    }

    if (userDb.isVerified) {
        throw new ApiError(409, USER_ALREADY_VERIFIED);
    }

    const dbVerificationCode = await verificationCodesRepository.getLastUserVerificationCodeByUserId(userDb.id);

    if (!dbVerificationCode) {
        throw new ApiError(404, VERIFICATION_CODE_NOT_FOUND);
    }

    if (data.verificationCode !== dbVerificationCode.verificationCode) {
        throw new ApiError(400, VERIFICATION_CODE_MISMATCH);
    }

    if (new Date() > dbVerificationCode.expiredAt) {
        throw new ApiError(400, VERIFICATION_CODE_EXPIRED);
    }

    await usersRepository.updateUserByEmail({
        email: userDb.email,
        updatedAt: new Date(),
    });

    await verificationCodesRepository.updateVerificationCodeById({
        id: dbVerificationCode.id,
        updatedAt: new Date(),
    })
}

export const usersService = {
    registerUser,
    verifyUser
} as const;