import {verificationCodesRepository} from "../repositories/verification-code.repository";
import {createExpirationDate, createVerificationCode} from "../utils/create.verification-code";
import {VerificationCodeType} from "@prisma/client";
import {sendOtpEmail} from "../utils/send.verification-code";


const createAndSendVerificationEmailCode = async (userId: string, email: string): Promise<void> => {
    const createdVerificationCode = await verificationCodesRepository.createVerificationCode({
        userId: userId,
        verificationCode: createVerificationCode(),
        expiredAt: createExpirationDate(new Date()),
        createdAt: new Date(),
        type: VerificationCodeType.EMAIL_VERIFICATION,
    });

    await sendOtpEmail({
        email: email,
        verificationCode: createdVerificationCode.verificationCode,
    });
};

export const otpService = {
    createAndSendVerificationEmailCode
}