import {Resume} from "@prisma/client";
import {prismaClient} from "../config/prismaClient";
import {
    CreateResumeDto, DeleteResumeByIdDto,
    findResumeByIdAndUserIdDto,
    UpdateResumeServiceDto,
    UserResumeByIdDto
} from "../types/dto/resume.dto";


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

const updateResumeById = async (data: UpdateResumeServiceDto): Promise<Resume | null> => {
    const { userId, resumeId, ...updateFields } = data;

    return prismaClient.resume.update({
        where: {
            id: data.resumeId,
            userId: data.userId,
        },
        data: {
            ...Object.fromEntries(
                Object.entries(updateFields).filter(([, value]) => value !== undefined)
            ),
            updatedAt: new Date(),
        }
    })
}

const deleteResumeById = async (data: DeleteResumeByIdDto): Promise<Resume | null> => {
    return prismaClient.resume.delete({
        where: {
            id: data.resumeId,
            userId: data.userId,
        }
    })
}

export const resumeRepository = {
    createResume,
    findResumeByIdAndUserId,
    getResumesUserById,
    updateResumeById,
    deleteResumeById
}