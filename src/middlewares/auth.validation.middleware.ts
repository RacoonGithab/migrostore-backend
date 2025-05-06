import {Request, Response, NextFunction} from "express";
import {tokenUtils} from "../utils/token.util";
import {RefreshTokenPayload, TokenPayload} from "../types/dto/token.dto";


export const accessTokenValidationMiddleware = async (
    req: Request & { user?: { id: string; role?: string } },
    _res: Response, next: NextFunction
): Promise<void> => {
    const payload = await tokenUtils.validateToken(
        req,
        tokenUtils.verifyAccessToken,
        'access'
    ) as TokenPayload & { jti?: string; exp?: number };

    req.params = { id: payload.userId, role: payload.role };
    next();
}

export const refreshTokenValidationMiddleware = async (
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    const payload = await tokenUtils.validateToken(
        req,
        tokenUtils.verifyRefreshToken,
        'refresh'
    ) as RefreshTokenPayload & { jti: string; exp?: number };

    req.params = { userId: payload.userId, jti: payload.jti };
    next();
}


