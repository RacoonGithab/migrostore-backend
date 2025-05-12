import {error} from "../utils/constants/error.masseges";
import ApiError from "../errors/api.error";
import {TypeLoginUser} from "../types/user.types";
import {usersRepository} from "../repositories/user.repository";
import {sessionsRepository} from "../repositories/session.repository";
import bcrypt from "bcryptjs";
import {tokenUtils} from "../utils/token.util"
import {TokenDto} from "../types/dto/token.dto";
import {tokenRedisUtil} from "../utils/redis.token.util";
import {verificationCodeService} from "./verification-code.service";
import {TypeVerifyUser} from "../types/verify.user.types";
import {verificationCodesRepository} from "../repositories/verification-code.repository";
import {VerificationCodeType} from "@prisma/client";


const loginUser = async (data: TypeLoginUser): Promise<TokenDto> => {
    const userDb = await usersRepository.getUserByEmail(data.email);

    if (!userDb) {
        throw new ApiError(401, error.USER_DOES_NOT_EXIST);
    }

    if (!userDb.isVerified) {
        throw new ApiError(403, error.EMAIL_NOT_VERIFIED)
    }

    const passwordMatch = await bcrypt.compare(data.password, userDb.password);

    if (!passwordMatch) {
        throw new ApiError(401, error.INCORRECT_PASSWORD);
    }

    const activeSession = await sessionsRepository.findActiveSessionByUserId(userDb.id);

    if (activeSession) {
        await verificationCodeService.createAndSendLoginVerificationCode(userDb.id, userDb.email);
        throw new ApiError(409, error.ACTIVE_SESSION_EXISTS)
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

const verifyLoginCodeLogin = async (data: TypeVerifyUser): Promise<void> => {
    const userDb = await usersRepository.getUserByEmail(data.email);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    const dbVerificationCode = await verificationCodesRepository.getLastActiveVerificationCode(
        userDb.id,
        VerificationCodeType.SECOND_FACTOR_LOGIN
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

const refreshAccessToken = async (userId: string): Promise<TokenDto> => {
    const session = await sessionsRepository.findActiveSessionByUserId(userId)

    if (!session || !session.isActive) {
        throw new ApiError(401, error.INVALID_TOKEN_HEADER);
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
        throw new ApiError(404, error.USER_NOT_FOUND);
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

const logoutUser = async (userId: string) => {
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


export const authService = {
    loginUser,
    verifyLoginCodeLogin,
    logoutUser,
    refreshAccessToken
}