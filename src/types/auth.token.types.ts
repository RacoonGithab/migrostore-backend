import {RefreshTokenPayload, AccessTokenPayload, ResetTokenPayload} from "./dto/token.dto";


export type VerifyAccessTokenFn = (token: string) => AccessTokenPayload | null;
export type VerifyRefreshTokenFn = (token: string) => RefreshTokenPayload | null;
export type VerifyResetPasswordTokenFn = (token: string) => ResetTokenPayload | null;

export type VerifyTokenFn = VerifyAccessTokenFn | VerifyRefreshTokenFn | VerifyResetPasswordTokenFn;
export type PayloadTokenType = AccessTokenPayload | RefreshTokenPayload | ResetTokenPayload;