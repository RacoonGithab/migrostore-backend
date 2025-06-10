import {error} from "../utils/constants/error.masseges";
import ApiError from "../errors/api.error";
import {TypeLoginUser} from "../types/user.types";
import {usersRepository} from "../repositories/user.repository";
import {sessionsRepository} from "../repositories/session.repository";
import bcrypt from "bcryptjs";
import {tokenUtils} from "../utils/token.util"
import {TokenDto} from "../types/dto/token.dto";
import {tokenRedisUtil} from "../utils/redis.token.util";
import {TypeVerifyUser} from "../types/verify.user.types";
import {verificationCodesRepository} from "../repositories/verification-code.repository";
import {VerificationCodeType} from "@prisma/client";
import {createExpirationDate, createVerificationCode} from "../utils/create.verification-code";
import {EMAIL_DETAILS} from "../utils/constants/email.constants";
import {sendVerificationEmail} from "../utils/send.verification-code";
import {env} from "../config/secrets";


const loginUser = async (data: TypeLoginUser): Promise<TokenDto> => {
    const userDb = await usersRepository.getUserByEmail(data.email);

    if (!userDb) {
        throw new ApiError(401, error.USER_DOES_NOT_EXIST);
    }

    if (!userDb.isVerified) {
        throw new ApiError(403, error.EMAIL_NOT_VERIFIED);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    const passwordMatch = await bcrypt.compare(data.password, userDb.password);

    if (!passwordMatch) {
        throw new ApiError(401, error.INCORRECT_PASSWORD);
    }

    const activeSession = await sessionsRepository.findActiveSessionByUserId(userDb.id);

    if (activeSession) {
        const verificationCode = createVerificationCode();

        await verificationCodesRepository.createVerificationCode({
            userId: userDb.id,
            verificationCode: verificationCode,
            expiredAt: createExpirationDate(new Date()),
            createdAt: new Date(),
            type: VerificationCodeType.SECOND_FACTOR_LOGIN,
        });

        const emailDetails = EMAIL_DETAILS[VerificationCodeType.SECOND_FACTOR_LOGIN];

        await sendVerificationEmail(
            userDb.email,
            verificationCode,
            emailDetails.subject,
            emailDetails.fromName
        );

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

const verifyLoginCode = async (data: TypeVerifyUser): Promise<void> => {
    const userDb = await usersRepository.getUserByEmail(data.email);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (!userDb.isVerified) {
        throw new ApiError(409, error.EMAIL_NOT_VERIFIED);
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
        const updatedCode = await verificationCodesRepository.incrementCodeAttempts(dbVerificationCode.id); // Передаем ID!

        if (updatedCode.attempts >= env.MAX_CODE_ATTEMPTS) {
            await verificationCodesRepository.updateVerificationCodeById({
                id: dbVerificationCode.id,
                updatedAt: new Date(),
            });
            throw new ApiError(400, error.VERIFICATION_CODE_EXCEEDED_ATTEMPTS_LIMIT);
        }

        throw new ApiError(400, error.VERIFICATION_CODE_MISMATCH);
    }

    if (new Date() > dbVerificationCode.expiredAt) {
        await verificationCodesRepository.updateVerificationCodeById({
            id: dbVerificationCode.id,
            updatedAt: new Date(),
        })
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
    verifyLoginCode,
    logoutUser,
    refreshAccessToken
}