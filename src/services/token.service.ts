import jwt from 'jsonwebtoken';
import {RefreshTokenPayload, TokenPayload} from "../types/token.payload.dto";
import {env} from "../config/secrets";
import {ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN} from "../utils/constants/token.constants";
import { v4 as uuidv4 } from 'uuid';


const generateTokenPair = (payload: TokenPayload) => {
    const jti = uuidv4();
    const accessTokenPayload = { ...payload, jti };
    const accessToken = jwt.sign(accessTokenPayload, env.JWT_ACCESS_SECRET, {expiresIn: ACCESS_TOKEN_EXPIRES_IN});
    const refreshTokenPayload = { userId: payload.userId, jti };
    const refreshToken = jwt.sign(refreshTokenPayload, env.JWT_REFRESH_SECRET, {expiresIn: REFRESH_TOKEN_EXPIRES_IN});
    return {accessToken, refreshToken};
}

const verifyAccessToken = (token: string): TokenPayload | null => {
    try {
        return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload & { jti?: string, exp?: number };
    } catch (error) {
        return null;
    }
}

const verifyRefreshToken = (token: string): RefreshTokenPayload | null => {
    try {
        return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload & { jti?: string, exp?: number };
    } catch (error) {
        return null;
    }
}

export const tokenService = {
    generateTokenPair,
    verifyAccessToken,
    verifyRefreshToken
}