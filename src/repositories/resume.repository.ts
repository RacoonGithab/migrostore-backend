import {Prisma, Resume} from "@prisma/client";
import {prismaClient} from "../config/prismaClient";
import {findResumeByIdAndUserIdDto} from "../types/dto/resume.dto";


export const createResume = async (data: Prisma.ResumeCreateInput, tx?: Prisma.TransactionClient): Promise<Resume> => {
    const prisma = tx || prismaClient;

    return prisma.resume.create({
        data: data,
    });
};

const findResumeByIdAndUserId = async (data: findResumeByIdAndUserIdDto): Promise<Resume | null> => {
       return prismaClient.resume.findFirst({
            where: {
                id: data.resumeId,
                userId: data.userId,
            },
        });
}

export const updateResumePdfFilename = async (resumeId: string, pdfFilename: string): Promise<Resume> => {
    return prismaClient.resume.update({
        where: { id: resumeId },
        data: {
            pdfFilename: pdfFilename,
        },
    });
};


export const resumeRepository = {
    createResume,
    findResumeByIdAndUserId,
    updateResumePdfFilename
}