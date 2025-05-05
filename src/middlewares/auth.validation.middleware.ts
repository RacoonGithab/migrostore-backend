import {Request, Response, NextFunction} from "express";
import ApiError from "../errors/ApiError";
import {INVALID_AUTHORIZATION_HEADER, INVALID_TOKEN_HEADER} from "../utils/constants/error.masseges";
import {tokenService} from "../services/token.service";
import {TokenPayload} from "../types/token.payload.dto";
import {redisService} from "../services/redis.service";


export const authValidationMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        throw new ApiError(401, INVALID_AUTHORIZATION_HEADER)
    }

    const token = authHeader.split(" ")[1];
    const payload = tokenService.verifyAccessToken(token) as TokenPayload & { jti?: string };

    if (!payload) {
        throw new ApiError(401, INVALID_TOKEN_HEADER)
    }

    if (payload.jti) {
        const isBlacklisted = await redisService.isJtiBlacklisted(payload.jti);
        if (isBlacklisted) {
            throw new ApiError(401, INVALID_TOKEN_HEADER);
        }
    }

    req.params = { id: payload.userId, role: payload.role };
    next();
}