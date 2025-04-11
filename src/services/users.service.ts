import {usersRepository} from "../repositories/user.repository";
import {TypeRegisterUser} from "../types/user.register";
import {createPasswordHash} from "../utils/auth.util";
import ApiError from "../errors/ApiError";
import {USER_ALREADY_EXISTS} from "../utils/constants/error.masseges";
import {verificationCodesRepository} from "../repositories/verificationCode.repository";
import {createExpirationDate, createVerificationCode} from "../utils/create.verification-code";
import {sendOtpEmail} from "../utils/send.verification-code";

const registerUser = async (data: TypeRegisterUser):Promise<void> => {
    const userDb = await usersRepository.getByEmail(data.email);

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
    })
}

export const usersService = {
    registerUser,
} as const;