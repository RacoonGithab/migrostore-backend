export interface CreateVerificationCodeDto {
    userId: string;
    verificationCode: string;
    expiredAt: Date;
    updatedAt: Date;
    createdAt: Date;
}

export interface GetVerificationCodesDto {
    userId: string,
    startDate: Date,
    endDate: Date
}

export interface UpdateVerificationCodeDto {
    id: number,
    updatedAt: Date
}