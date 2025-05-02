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
import {createSessionExpirationDate} from "../utils/auth.util";


const loginService = async (data: TypeLoginUser): Promise<void> => {
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

    const expiresAt = createSessionExpirationDate();

    await sessionsRepository.createSession({
        userId: userDb.id,
        expiredAt: expiresAt,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    await usersRepository.updateUserActivityStatus({
        userId: userDb.id,
        isActive: true,
    });
}

export const authService = {
    loginService,
}