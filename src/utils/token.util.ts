import { Request } from "express";
import ApiError from "../errors/ApiError";
import { INVALID_AUTHORIZATION_HEADER, INVALID_TOKEN_HEADER } from "../utils/constants/error.masseges";
import { redisService } from "../services/redis.service";
import {RefreshTokenPayload, TokenPayload} from "../types/dto/token.dto";
import {v4 as uuidv4} from "uuid";
import jwt from "jsonwebtoken";
import {env} from "../config/secrets";
import {ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN} from "./constants/token.constants";
import {PayloadTokenType, VerifyTokenFn} from "../types/auth.token.types";


const generateTokenPair = (payload: TokenPayload) => {
    const accessTokenJti = uuidv4();
    const refreshTokenJti = uuidv4();
    const accessTokenPayload = { ...payload, jti: accessTokenJti };
    const accessToken = jwt.sign(accessTokenPayload, env.JWT_ACCESS_SECRET, {expiresIn: ACCESS_TOKEN_EXPIRES_IN});
    const refreshTokenPayload = { userId: payload.userId, jti: refreshTokenJti };
    const refreshToken = jwt.sign(refreshTokenPayload, env.JWT_REFRESH_SECRET, {expiresIn: REFRESH_TOKEN_EXPIRES_IN});
    return {accessToken, refreshToken};
}


const verifyAccessToken = (token: string): TokenPayload | null => {
    try {
        return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload & { jti?: string; exp?: number };
    } catch (error) {
        return null;
    }
}

const verifyRefreshToken = (token: string): RefreshTokenPayload | null => {
    try {
        return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload & { jti?: string; exp?: number };
    } catch (error) {
        return null;
    }
}

const decodeToken = (token: string): TokenPayload | RefreshTokenPayload | null => {
    try {
        return jwt.decode(token) as TokenPayload | RefreshTokenPayload | null;
    } catch (error) {
        return null;
    }
}

const getExpirationTime = (token: string): number | null => {
    try {
        const decoded = jwt.decode(token) as { exp?: number };
        return decoded?.exp ? decoded.exp * 1000 : null; // Переводимо в мілісекунди
    } catch (error) {
        return null;
    }
}

export const validateToken = async (
    req: Request,
    verifyFn: VerifyTokenFn,
    _PayloadTokenType: 'access' | 'refresh'
): Promise<(PayloadTokenType & { jti?: string; exp?: number })> => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        throw new ApiError(401, INVALID_AUTHORIZATION_HEADER);
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyFn(token);

    if (!payload) {
        throw new ApiError(401, INVALID_TOKEN_HEADER);
    }

    if (payload.jti) {
        const isBlacklisted = await redisService.isJtiBlacklisted(payload.jti);
        if (isBlacklisted) {
            throw new ApiError(401, INVALID_TOKEN_HEADER);
        }
    }

    return payload;
};

export const tokenUtils = {
    generateTokenPair,
    verifyAccessToken,
    verifyRefreshToken,
    validateToken,
    decodeToken,
    getExpirationTime
}