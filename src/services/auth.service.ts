import {
    ACTIVE_SESSION_EXISTS,
    EMAIL_NOT_VERIFIED,
    INCORRECT_PASSWORD,
    INVALID_TOKEN_HEADER, REQUEST_LIMIT_EXHAUSTED,
    USER_BLOCKED,
    USER_DOES_NOT_EXIST,
    USER_NOT_FOUND,
    VERIFICATION_CODE_EXPIRED,
    VERIFICATION_CODE_MISMATCH,
    VERIFICATION_CODE_NOT_FOUND
} from "../utils/constants/error.masseges";
import ApiError from "../errors/ApiError";
import {TypeLoginUser} from "../types/user.types";
import {usersRepository} from "../repositories/user.repository";
import {sessionsRepository} from "../repositories/session.repository";
import bcrypt from "bcryptjs";
import {tokenUtils} from "../utils/token.util"
import {TokenDto} from "../types/dto/token.dto";
import {tokenRedisUtil} from "../utils/token.redis.util";
import {verificationCodeService} from "./verification-code.service";
import {TypeVerifyUser} from "../types/verify.user.types";
import {verificationCodesRepository} from "../repositories/verification-code.repository";
import {VerificationCodeType} from "@prisma/client";
import {
    checkForgotPasswordRateLimitExceeded,
    incrementForgotPasswordRequestCount
} from "../utils/limiter.reset-password";
import {createPasswordHash} from "../utils/auth.util";
import {PasswordResetData} from "../types/dto/users.dto";


const loginService = async (data: TypeLoginUser): Promise<TokenDto> => {
    const userDb = await usersRepository.getUserByEmail(data.email);

    if (!userDb) {
        throw new ApiError(401, USER_DOES_NOT_EXIST);
    }

    if (!userDb.isVerified) {
        throw new ApiError(403, EMAIL_NOT_VERIFIED)
    }

    const passwordMatch = await bcrypt.compare(data.password, userDb.password);

    if (!passwordMatch) {
        throw new ApiError(401, INCORRECT_PASSWORD);
    }

    const activeSession = await sessionsRepository.findActiveSessionByUserId(userDb.id);

    if (activeSession) {
        await verificationCodeService.createAndSendLoginVerificationCode(userDb.id, userDb.email);
        throw new ApiError(409, ACTIVE_SESSION_EXISTS)
    }

    const { accessToken, refreshToken } = tokenUtils.generateTokenPair({ userId: userDb.id, role: userDb.role });

    await sessionsRepository.createSession({
        userId: userDb.id,
        accessToken: accessToken,
        refreshToken: refreshToken,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    return {accessToken, refreshToken}
}

const verifyLoginCodeLoginService = async (data: TypeVerifyUser): Promise<void> => {
    const userDb = await usersRepository.getUserByEmail(data.email);

    if (!userDb) {
        throw new ApiError(404, USER_NOT_FOUND);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, USER_BLOCKED);
    }

    const dbVerificationCode = await verificationCodesRepository.getLastActiveVerificationCode(
        userDb.id,
        VerificationCodeType.SECOND_FACTOR_LOGIN
    );

    if (!dbVerificationCode) {
        throw new ApiError(404, VERIFICATION_CODE_NOT_FOUND);
    }

    if (data.verificationCode !== dbVerificationCode.verificationCode) {
        throw new ApiError(400, VERIFICATION_CODE_MISMATCH);
    }

    if (new Date() > dbVerificationCode.expiredAt) {
        throw new ApiError(400, VERIFICATION_CODE_EXPIRED);
    }

    const session = await sessionsRepository.findActiveSessionByUserId(userDb.id);

    if (session) {
        await sessionsRepository.deactivationSession({
            id: session.id,
            isActive: false,
            updatedAt: new Date(),
        });

        if (session.accessToken) {
            await tokenRedisUtil.blackListToken(session.accessToken);
        }

        if (session.refreshToken) {
            await tokenRedisUtil.blackListToken(session.refreshToken)
        }
    }

    await verificationCodesRepository.updateVerificationCodeById({
        id: dbVerificationCode.id,
        updatedAt: new Date(),
    });
}

const initiatePasswordResetService = async (email: string): Promise<void> => {

    if (await checkForgotPasswordRateLimitExceeded(email)) {
        throw new ApiError(429, REQUEST_LIMIT_EXHAUSTED);
    }

    const userDb = await usersRepository.getUserByEmail(email);

    if (!userDb) {
        throw new ApiError(404, USER_NOT_FOUND);
    }

    if (!userDb.isVerified) {
        throw new ApiError(403, EMAIL_NOT_VERIFIED)
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, USER_BLOCKED);
    }

    await verificationCodeService.createAndSendResetPasswordVerificationCode(userDb.id, email);

    await incrementForgotPasswordRequestCount(email);

}

const verifyPasswordResetCodeService = async (data: TypeVerifyUser): Promise<string> => {
    const userDb = await usersRepository.getUserByEmail(data.email);

    if (!userDb) {
        throw new ApiError(404, USER_NOT_FOUND);
    }

    const dbVerificationCode = await verificationCodesRepository.getLastActiveVerificationCode(
        userDb.id,
        VerificationCodeType.PASSWORD_RESET
    );

    if (!dbVerificationCode) {
        throw new ApiError(404, VERIFICATION_CODE_NOT_FOUND);
    }

    if (data.verificationCode !== dbVerificationCode.verificationCode) {
        throw new ApiError(400, VERIFICATION_CODE_MISMATCH);
    }

    if (new Date() > dbVerificationCode.expiredAt) {
        throw new ApiError(400, VERIFICATION_CODE_EXPIRED);
    }

    await verificationCodesRepository.updateVerificationCodeById({
        id: dbVerificationCode.id,
        updatedAt: new Date(),
    });

    return tokenUtils.generatePasswordResetToken(userDb.id);
}

const passwordResetService = async (data: PasswordResetData): Promise<void> => {
    const userDb = await usersRepository.getUserById(data.userId);

    if (!userDb) {
        throw new ApiError(404, USER_NOT_FOUND);
    }

    if (!userDb.isVerified) {
        throw new ApiError(403, EMAIL_NOT_VERIFIED)
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, USER_BLOCKED);
    }


    await usersRepository.updateUserPassword({
        userId: data.userId,
        newPassword: await createPasswordHash(data.newPassword),
    });

    await tokenRedisUtil.blackListToken(data.resetToken)

}

const logoutService = async (userId: string) => {
    const session = await sessionsRepository.findActiveSessionByUserId(userId);

    if (session) {
        await sessionsRepository.deactivationSession({
            id: session.id,
            isActive: false,
            updatedAt: new Date()
        });

        if (session.accessToken) {
            await tokenRedisUtil.blackListToken(session.accessToken);
        }

        if (session.refreshToken) {
            await tokenRedisUtil.blackListToken(session.refreshToken)
        }
    }
}

const refreshAccessTokenService = async (userId: string): Promise<TokenDto> => {
    const session = await sessionsRepository.findActiveSessionByUserId(userId)

    if (!session || !session.isActive) {
        throw new ApiError(401, INVALID_TOKEN_HEADER);
    }

    const isAccessTokenValid = tokenUtils.verifyAccessToken(session.accessToken)

    if (isAccessTokenValid) {
        await tokenRedisUtil.blackListToken(session.accessToken);
    }

    if (session.refreshToken) {
        await tokenRedisUtil.blackListToken(session.refreshToken)
    }

    const user = await usersRepository.getUserById(userId);
    if (!user) {
        throw new ApiError(404, USER_NOT_FOUND);
    }

    const newTokenPair = tokenUtils.generateTokenPair({userId: user.id, role: user.role});

    await sessionsRepository.updateSession({
        id: session.id,
        isActive: true,
        updatedAt: new Date(),
        accessToken: newTokenPair.accessToken,
        refreshToken: newTokenPair.refreshToken,
    });


    return newTokenPair;
}

export const authService = {
    loginService,
    verifyLoginCodeLoginService,
    logoutService,
    refreshAccessTokenService,
    initiatePasswordResetService,
    verifyPasswordResetCodeService,
    passwordResetService
}