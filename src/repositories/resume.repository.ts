import {Resume} from "@prisma/client";
import {prismaClient} from "../config/prismaClient";
import {CreateResumeDto, findResumeByIdAndUserIdDto, UserResumeByIdDto} from "../types/dto/resume.dto";


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


const getResumesUserById = async (userId: string): Promise<UserResumeByIdDto[]> => {
    return prismaClient.resume.findMany({
        where: {userId},
        select: {
            id: true,
            skills: true,
            city: true,
        },
    });
}


export const resumeRepository = {
    createResume,
    findResumeByIdAndUserId,
    getResumesUserById
}