
export interface CreateSessionDto {
    userId: string;
    accessToken: string;
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UpdateSessionDto {
    id: string;
    isActive: boolean;
    updatedAt: Date;
}

export interface RefreshTokenSessionDto {
    id: string;
    isActive: boolean;
    accessToken: string;
    refreshToken: string;
    updatedAt: Date;
}