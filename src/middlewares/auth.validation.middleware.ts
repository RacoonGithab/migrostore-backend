import {Request, Response, NextFunction} from "express";
import {tokenUtils} from "../utils/token.util";
import {RefreshTokenPayload, AccessTokenPayload} from "../types/dto/token.dto";


export const accessTokenValidationMiddleware = async (
    req: Request & { user?: AccessTokenPayload },
    _res: Response, next: NextFunction
): Promise<void> => {
    const payload = await tokenUtils.validateToken(
        req,
        tokenUtils.verifyAccessToken,
        'access'
    ) as AccessTokenPayload;

    req.params = { userId: payload.userId, role: payload.role };
    next();
}

export const refreshTokenValidationMiddleware = async (
    req: Request & { user?: RefreshTokenPayload},
    _res: Response,
    next: NextFunction
): Promise<void> => {
    const payload = await tokenUtils.validateToken(
        req,
        tokenUtils.verifyRefreshToken,
        'refresh'
    ) as RefreshTokenPayload;

    req.params = { userId: payload.userId, jti: payload.jti };
    next();
}


