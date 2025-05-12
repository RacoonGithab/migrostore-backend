import { Request } from "express";
import ApiError from "../errors/api.error";
import {error} from "./constants/error.masseges";
import { tokenRedisUtil } from "./redis.token.util";
import {
    AccessTokenPayload,
    RefreshTokenPayload,
    ResetTokenPayload,
    TokenDto,
    TokenGenerationPayload
} from "../types/dto/token.dto";
import {v4 as uuidv4} from "uuid";
import jwt from "jsonwebtoken";
import {env} from "../config/secrets";
import {
    ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN,
    RESET_PASSWORD_TOKEN_EXPIRES_IN
} from "./constants/token.constants";
import {PayloadTokenType, VerifyTokenFn} from "../types/auth.token.types";


const generateAccessToken = (payload: TokenGenerationPayload): string => {
    const jti = uuidv4();
    const accessTokenPayload: AccessTokenPayload = {
        ...payload,
        jti,
    };
    return jwt.sign(accessTokenPayload, env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
};

const verifyAccessToken = (token: string): AccessTokenPayload | null => {
    try {
        return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
    } catch (error) {
        return null;
    }
}



const generateRefreshToken = (payload: Pick<TokenGenerationPayload, 'userId'>): string => {
    const jti = uuidv4();
    const refreshTokenPayload: RefreshTokenPayload = {
        userId: payload.userId,
        jti,
    };
    return jwt.sign(refreshTokenPayload, env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
};

const verifyRefreshToken = (token: string): RefreshTokenPayload | null => {
    try {
        return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
    } catch (error) {
        return null;
    }
}



const generateTokenPair = (payload: TokenGenerationPayload): TokenDto => {
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken({ userId: payload.userId });
    return { accessToken, refreshToken };
};



const generatePasswordResetToken = (userId: string): string => {
    const payload = {
        userId: userId,
        jti: uuidv4(),
    };
    return jwt.sign(payload, env.JWT_RESET_PASSWORD_SECRET, { expiresIn: RESET_PASSWORD_TOKEN_EXPIRES_IN });
};

const verifyPasswordResetToken = (token: string): ResetTokenPayload | null => {
    try {
        return jwt.verify(token, env.JWT_RESET_PASSWORD_SECRET) as ResetTokenPayload;
    } catch (error) {
        return null;
    }
}



const decodeToken = (token: string): AccessTokenPayload | RefreshTokenPayload | null => {
    try {
        return jwt.decode(token) as AccessTokenPayload | RefreshTokenPayload | null;
    } catch (error) {
        return null;
    }
}



export const validateToken = async (
    req: Request,
    verifyFn: VerifyTokenFn,
    _PayloadTokenType: 'access' | 'refresh' | 'reset_token',
): Promise<PayloadTokenType> => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        throw new ApiError(401, error.INVALID_AUTHORIZATION_HEADER);
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyFn(token);

    if (!payload) {
        throw new ApiError(401, error.INVALID_TOKEN_HEADER);
    }

    if (payload.jti) {
        const isBlacklisted = await tokenRedisUtil.isJtiBlacklisted(payload.jti);
        if (isBlacklisted) {
            throw new ApiError(401, error.INVALID_TOKEN_HEADER);
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
    generatePasswordResetToken,
    verifyPasswordResetToken
}