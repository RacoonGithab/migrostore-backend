import {NextFunction, Request, Response} from "express";
import {ResetTokenPayload} from "../types/dto/token.dto";
import {tokenUtils} from "../utils/token.util";



export const resetPasswordTokenValidation = async (
    req: Request & { user?: ResetTokenPayload},
    _res: Response,
    next: NextFunction
): Promise<void> => {
    const {payload, token} = await tokenUtils.validateToken(
        req,
        tokenUtils.verifyPasswordResetToken,
        'reset_token'
    );

    req.params = { ...payload, resetToken: token };
    next();
}