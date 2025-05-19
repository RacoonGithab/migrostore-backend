import {Prisma, Resume} from "@prisma/client";
import {prismaClient} from "../config/prismaClient";
import {CreateResumeDto, findResumeByIdAndUserIdDto} from "../types/dto/resume.dto";


export const createResume = async (data: CreateResumeDto): Promise<Resume> => {
    return prismaClient.resume.create({data});
};

const findResumeByIdAndUserId = async (data: findResumeByIdAndUserIdDto): Promise<Resume | null> => {
       return prismaClient.resume.findFirst({
            where: {
                id: data.resumeId,
                userId: data.userId,
            },
        });
}



export const resumeRepository = {
    createResume,
    findResumeByIdAndUserId,
}