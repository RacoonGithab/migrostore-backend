import {Roles} from "@prisma/client";

export interface TokenPayload {
    userId: string;
    role: Roles
    jti?: string;
    exp?: number;
}

export interface TokenDto {
    accessToken: string;
    refreshToken: string;
}

export interface RefreshTokenPayload {
    userId: string;
    jti?: string;
    exp?: number;
}

export interface RequestTypeExtensionDto {
    id: string;
    role?: string
}
