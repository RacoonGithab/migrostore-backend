export interface CreateVerificationCodeDto {
    userId: string;
    verificationCode: string;
    expiredAt: Date;
    updatedAt: Date;
    createdAt: Date;
}