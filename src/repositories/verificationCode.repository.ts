import {prismaClient} from "../config/prismaClient";
import {VerificationCode} from "@prisma/client";
import {CreateVerificationCodeDto} from "../types/verification-code.dto";

const createVerificationCode = async (data : CreateVerificationCodeDto): Promise<VerificationCode> => {
    return prismaClient.verificationCode.create({
        data: data
    })
}

const getLastUserVerificationCodeByUserId = async (userId: string):Promise<VerificationCode | null> => {
    return prismaClient.verificationCode.findFirst({
        where: {
            userId: userId,
            isActive: true,
        },
        orderBy: {
            createdAt: "desc"
        }
    });
}


const updateVerificationCodeById = async (data: {id: number, updatedAt: Date}): Promise<void> => {
    await prismaClient.verificationCode.update({
        where: {
            id: data.id,
        },
        data: {
            isActive: false,
            updatedAt: data.updatedAt,
        }
    });
}

export const verificationCodesRepository = {
    createVerificationCode,
    getLastUserVerificationCodeByUserId,
    updateVerificationCodeById
}