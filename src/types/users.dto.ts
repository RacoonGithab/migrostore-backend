
export interface CreateUserDto {
    email: string;
    password: string;
    updatedAt: Date;
    createdAt: Date;
}

export interface updateUserActivityStatusDto {
    userId: string;
    isActive: boolean;
}

export interface CreateSessionDto {
    userId: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}