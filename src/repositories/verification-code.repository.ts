import {prismaClient} from "../config/prismaClient";
import {VerificationCode} from "@prisma/client";
import {
    CreateVerificationCodeDto,
    GetVerificationCodesDto,
    UpdateVerificationCodeDto
} from "../types/verification-code.dto";

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


const updateVerificationCodeById = async (data: UpdateVerificationCodeDto): Promise<void> => {
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

const getVerificationCodesTodayByUserId = async (data: GetVerificationCodesDto): Promise<VerificationCode[]> => {
    return prismaClient.verificationCode.findMany({
        where: {
            userId: data.userId,
            createdAt: {
                gte: data.startDate,
                lte: data.endDate,
            }
        },
        orderBy: {
            createdAt: "desc",
        }
    });
}

export const verificationCodesRepository = {
    createVerificationCode,
    getLastUserVerificationCodeByUserId,
    updateVerificationCodeById,
    getVerificationCodesTodayByUserId
}