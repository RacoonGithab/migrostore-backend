import {RefreshTokenPayload, TokenPayload} from "./dto/token.dto";


export type VerifyAccessTokenFn = (token: string) => (TokenPayload & { jti?: string; exp?: number }) | null;
export type VerifyRefreshTokenFn = (token: string) => (RefreshTokenPayload & { jti?: string; exp?: number }) | null;

export type VerifyTokenFn = VerifyAccessTokenFn | VerifyRefreshTokenFn;
export type PayloadTokenType = TokenPayload | RefreshTokenPayload;