import {Roles} from "@prisma/client";

export interface TokenGenerationPayload {
    userId: string;
    role: Roles;
}

export interface AccessTokenPayload {
    userId: string;
    role: Roles
    jti: string;
}

export interface RefreshTokenPayload {
    userId: string;
    jti: string;
}

export interface ResetTokenPayload {
    userId: string;
    jti: string;
}

export interface TokenDto {
    accessToken: string;
    refreshToken: string;
}

