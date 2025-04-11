import {prismaClient} from "../config/prismaClient";
import {VerificationCode} from "@prisma/client";
import {CreateVerificationCodeDto} from "../types/verification-code.dto";

const createVerificationCode = async (data : CreateVerificationCodeDto): Promise<VerificationCode> => {
    return prismaClient.verificationCode.create({
        data: data
    })
}

export const verificationCodesRepository = {
    createVerificationCode,
}