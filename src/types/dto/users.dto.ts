
export interface CreateUserDto {
    email: string;
    password: string;
    updatedAt: Date;
    createdAt: Date;
}

export interface UpdateUserPasswordDto {
    userId: string,
    newPassword: string
}
