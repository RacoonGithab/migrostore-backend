import {RefreshTokenPayload, AccessTokenPayload} from "./dto/token.dto";


export type VerifyAccessTokenFn = (token: string) => AccessTokenPayload | null;
export type VerifyRefreshTokenFn = (token: string) => RefreshTokenPayload | null;

export type VerifyTokenFn = VerifyAccessTokenFn | VerifyRefreshTokenFn;
export type PayloadTokenType = AccessTokenPayload | RefreshTokenPayload;