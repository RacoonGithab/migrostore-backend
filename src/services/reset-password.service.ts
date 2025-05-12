import {
    checkForgotPasswordRateLimitExceeded,
    incrementForgotPasswordRequestCount
} from "../utils/limiter.reset-password";
import ApiError from "../errors/api.error";
import {error} from "../utils/constants/error.masseges";
import {usersRepository} from "../repositories/user.repository";
import {verificationCodeService} from "./verification-code.service";
import {TypeVerifyUser} from "../types/verify.user.types";
import {verificationCodesRepository} from "../repositories/verification-code.repository";
import {VerificationCodeType} from "@prisma/client";
import {tokenUtils} from "../utils/token.util";
import {createPasswordHash} from "../utils/create.password.hash";
import {tokenRedisUtil} from "../utils/redis.token.util";

const initiatePasswordReset = async (email: string): Promise<void> => {

    if (await checkForgotPasswordRateLimitExceeded(email)) {
        throw new ApiError(429, error.REQUEST_LIMIT_EXHAUSTED);
    }

    const userDb = await usersRepository.getUserByEmail(email);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (!userDb.isVerified) {
        throw new ApiError(403, error.EMAIL_NOT_VERIFIED)
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    await verificationCodeService.createAndSendResetPasswordVerificationCode(userDb.id, email);

    await incrementForgotPasswordRequestCount(email);

}

const verifyPasswordResetCode = async (data: TypeVerifyUser): Promise<string> => {
    const userDb = await usersRepository.getUserByEmail(data.email);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    const dbVerificationCode = await verificationCodesRepository.getLastActiveVerificationCode(
        userDb.id,
        VerificationCodeType.PASSWORD_RESET
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

    await verificationCodesRepository.updateVerificationCodeById({
        id: dbVerificationCode.id,
        updatedAt: new Date(),
    });

    return tokenUtils.generatePasswordResetToken(userDb.id);
}

const passwordReset = async (userId: string, newPassword: string, resetToken: string): Promise<void> => {
    const userDb = await usersRepository.getUserById(userId);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (!userDb.isVerified) {
        throw new ApiError(403, error.EMAIL_NOT_VERIFIED)
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }


    await usersRepository.updateUserPassword({
        userId: userId,
        newPassword: await createPasswordHash(newPassword),
    });

    await tokenRedisUtil.blackListToken(resetToken)

}

export const resetPasswordService = {
    initiatePasswordReset,
    verifyPasswordResetCode,
    passwordReset
}