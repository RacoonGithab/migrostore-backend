import {NextFunction, Request, Response} from "express";
import {RefreshTokenPayload} from "../types/dto/token.dto";
import {tokenUtils} from "../utils/token.util";


export const refreshTokenValidation = async (
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