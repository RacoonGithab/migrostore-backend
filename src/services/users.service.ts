import {usersRepository} from "../repositories/user.repository";
import {TypeRegisterUser} from "../types/user.types";
import {createPasswordHash} from "../utils/create.password.hash";
import ApiError from "../errors/api.error";
import {error} from "../utils/constants/error.masseges";
import {verificationCodesRepository} from "../repositories/verification-code.repository";
import {TypeResendVerificationCode, TypeVerifyUser} from "../types/verify.user.types";
import {endOfDay, startOfDay} from "date-fns";
import {env} from "../config/secrets";
import {VerificationCodeType} from "@prisma/client";
import {createExpirationDate, createVerificationCode} from "../utils/create.verification-code";
import {sendVerificationEmail} from "../utils/send.verification-code";
import {EMAIL_DETAILS} from "../utils/constants/email.constants";

const registerUser = async (data: TypeRegisterUser):Promise<void> => {
    const userDb = await usersRepository.getUserByEmail(data.email);

    if (userDb) {
        throw new ApiError(409, error.USER_ALREADY_EXISTS);
    }

    const createdUser = await usersRepository.createUser({
        email: data.email,
        password: await createPasswordHash(data.password),
        updatedAt: new Date(),
        createdAt: new Date()
    });

    const verificationCode = createVerificationCode();

    await verificationCodesRepository.createVerificationCode({
        userId: createdUser.id,
        verificationCode: verificationCode,
        expiredAt: createExpirationDate(new Date()),
        createdAt: new Date(),
        type: VerificationCodeType.EMAIL_VERIFICATION,
    });

    const emailDetails = EMAIL_DETAILS[VerificationCodeType.EMAIL_VERIFICATION];

    await sendVerificationEmail(
        createdUser.email,
        verificationCode,
        emailDetails.subject,
        emailDetails.fromName
    );
}

const verifyUser = async (data: TypeVerifyUser):Promise<void> => {
    const userDb = await usersRepository.getUserByEmail(data.email);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    if (userDb.isVerified) {
        throw new ApiError(409, error.USER_ALREADY_VERIFIED);
    }

    const dbVerificationCode = await verificationCodesRepository.getLastActiveVerificationCode(
        userDb.id,
        VerificationCodeType.EMAIL_VERIFICATION
    );

    if (!dbVerificationCode) {
        throw new ApiError(404, error.VERIFICATION_CODE_NOT_FOUND);
    }

    if (data.verificationCode !== dbVerificationCode.verificationCode) {
        throw new ApiError(400, error.VERIFICATION_CODE_MISMATCH);
    }

    if (new Date() > dbVerificationCode.expiredAt) {
        throw new ApiError(400, error.VERIFICATION_CODE_EXPIRED);
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

const resendVerificationCode = async (data: TypeResendVerificationCode): Promise<void> => {

    const userDb = await usersRepository.getUserByEmail(data.email);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    if (userDb.isVerified) {
        throw new ApiError(409, error.USER_ALREADY_VERIFIED);
    }

    const dbVerificationCodesToday = await verificationCodesRepository.getVerificationCodesTodayByUserId({
        userId: userDb.id,
        startDate: startOfDay(new Date()),
        endDate: endOfDay(new Date()),
    });

    if (dbVerificationCodesToday.length >= env.MAX_DAILY_VERIFICATION_CODES) {
        throw new ApiError(429, error.VERIFICATION_CODE_LIMIT_REACHED);
    }

    if (dbVerificationCodesToday.length > 0) {
        await verificationCodesRepository.updateVerificationCodeById({
            id: dbVerificationCodesToday[0].id,
            updatedAt: new Date(),
        });
    }

    const verificationCode = createVerificationCode();

    await verificationCodesRepository.createVerificationCode({
        userId: userDb.id,
        verificationCode: verificationCode,
        expiredAt: createExpirationDate(new Date()),
        createdAt: new Date(),
        type: VerificationCodeType.EMAIL_VERIFICATION,
    });

    const emailDetails = EMAIL_DETAILS[VerificationCodeType.EMAIL_VERIFICATION];

    await sendVerificationEmail(
        userDb.email,
        verificationCode,
        emailDetails.subject,
        emailDetails.fromName
    );
}


const deleteUser = async (userId:string):Promise<void> => {
    const userDb = await usersRepository.getUserById(userId);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (!userDb.isVerified) {
        throw new ApiError(403, error.EMAIL_NOT_VERIFIED);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    await usersRepository.deleteUserById(userId);
}

export const usersService = {
    registerUser,
    verifyUser,
    resendVerificationCode,
    deleteUser
} as const;