import {
    ACTIVE_SESSION_EXISTS,
    EMAIL_NOT_VERIFIED,
    INCORRECT_PASSWORD,
    USER_DOES_NOT_EXIST
} from "../utils/constants/error.masseges";
import ApiError from "../errors/ApiError";
import {TypeLoginUser} from "../types/user.types";
import {usersRepository} from "../repositories/user.repository";
import {sessionsRepository} from "../repositories/session.repository";
import bcrypt from "bcryptjs";
import {tokenService} from "./token.service";
import {TokenDto} from "../types/token.payload.dto";
import {redisService} from "./redis.service";


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

    const { accessToken, refreshToken } = tokenService.generateTokenPair({ userId: userDb.id, role: userDb.role });

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
        await sessionsRepository.updateSession({
            id: session.id,
            isActive: false,
            updatedAt: new Date()
        });

        if (session.accessToken) {
            await redisService.blackListToken(session.accessToken);
        }

        if (session.refreshToken) {
            await redisService.blackListToken(session.refreshToken)
        }
    }
};

export const authService = {
    loginService,
    logoutService
}