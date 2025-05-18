import {Request, Response, NextFunction} from "express";
import {tokenUtils} from "../utils/token.util";
import {AccessTokenPayload} from "../types/dto/token.dto";


export const accessTokenValidation = async (
    req: Request & { user?: AccessTokenPayload },
    _res: Response, next: NextFunction
): Promise<void> => {
    const payload = await tokenUtils.validateToken(
        req,
        tokenUtils.verifyAccessToken,
        'access'
    ) as AccessTokenPayload;

    req.params = { ...req.params, ...payload };
    next();
}



