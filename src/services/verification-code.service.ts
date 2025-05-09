import {verificationCodesRepository} from "../repositories/verification-code.repository";
import {createExpirationDate, createVerificationCode} from "../utils/create.verification-code";
import {VerificationCodeType} from "@prisma/client";
import {sendLoginVerificationCodeEmail, sendVerificationCodeEmail} from "../utils/send.verification-code";


const createAndSendVerificationEmailCode = async (userId: string, email: string): Promise<void> => {
    const createdVerificationCode = await verificationCodesRepository.createVerificationCode({
        userId: userId,
        verificationCode: createVerificationCode(),
        expiredAt: createExpirationDate(new Date()),
        createdAt: new Date(),
        type: VerificationCodeType.EMAIL_VERIFICATION,
    });

    await sendVerificationCodeEmail({
        email: email,
        verificationCode: createdVerificationCode.verificationCode,
    });
};

const createAndSendLoginVerificationCode = async (userId: string, email: string): Promise<void> => {
    const createdVerificationCode = await verificationCodesRepository.createVerificationCode({
        userId: userId,
        verificationCode: createVerificationCode(),
        expiredAt: createExpirationDate(new Date()),
        createdAt: new Date(),
        type: VerificationCodeType.SECOND_FACTOR_LOGIN,
    });

    await sendLoginVerificationCodeEmail({
        email: email,
        verificationCode: createdVerificationCode.verificationCode,
    })
}

export const verificationCodeService = {
    createAndSendVerificationEmailCode,
    createAndSendLoginVerificationCode
}