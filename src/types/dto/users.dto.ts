
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
