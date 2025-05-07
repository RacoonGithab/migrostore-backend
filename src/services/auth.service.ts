import {
    ACTIVE_SESSION_EXISTS,
    EMAIL_NOT_VERIFIED,
    INCORRECT_PASSWORD, INVALID_TOKEN_HEADER,
    USER_DOES_NOT_EXIST, USER_NOTFOUND
} from "../utils/constants/error.masseges";
import ApiError from "../errors/ApiError";
import {TypeLoginUser} from "../types/user.types";
import {usersRepository} from "../repositories/user.repository";
import {sessionsRepository} from "../repositories/session.repository";
import bcrypt from "bcryptjs";
import {tokenUtils} from "../utils/token.util"
import {TokenDto} from "../types/dto/token.dto";
import {tokenRedisUtil} from "../utils/token.redis.util";


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
        throw new ApiError(409, ACTIVE_SESSION_EXISTS);
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

const refreshAccessToken = async (userId: string): Promise<TokenDto> => {
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
        throw new ApiError(404, USER_NOTFOUND);
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
    logoutService,
    refreshAccessToken
}