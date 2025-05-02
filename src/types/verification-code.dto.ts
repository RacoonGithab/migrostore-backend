import {VerificationCodeType} from "@prisma/client";

export interface CreateVerificationCodeDto {
    userId: string;
    verificationCode: string;
    expiredAt: Date;
    createdAt: Date;
    type: VerificationCodeType;
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