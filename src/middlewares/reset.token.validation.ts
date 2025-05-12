import {NextFunction, Request, Response} from "express";
import {ResetTokenPayload} from "../types/dto/token.dto";
import {tokenUtils} from "../utils/token.util";


export const resetPasswordTokenValidation = async (
    req: Request & { user?: ResetTokenPayload },
    _res: Response,
    next: NextFunction
): Promise<void> => {
    const payload = await tokenUtils.validateToken(
        req,
        tokenUtils.verifyPasswordResetToken,
        'reset_token'
    ) as ResetTokenPayload;

    req.params = { userId: payload.userId, jti: payload.jti };
    next();
}