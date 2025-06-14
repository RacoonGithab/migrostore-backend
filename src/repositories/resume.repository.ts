import {Prisma, Resume} from "@prisma/client";
import {prismaClient} from "../config/prismaClient";
import {
    CreateResumeDto, DeleteResumeByIdDto,
    findResumeByIdAndUserIdDto,
    UpdateResumeServiceDto,
    UserResumeByIdDto
} from "../types/dto/resume.dto";


const createResume = async (data: CreateResumeDto): Promise<Resume> => {
    return prismaClient.resume.create({
        data: {
            title: data.title,
            email: data.email,
            phoneNumber: data.phoneNumber,
            firstName: data.firstName,
            lastName: data.lastName,
            photo: data.photo,
            dateOfBirth: data.dateOfBirth,
            country: data.country,
            aboutMe: data.aboutMe,
            skills: data.skills,
            qualification: data.qualification,
            userId: data.userId,

            workExperiences: {
                create: data.workExperiences?.map(exp => ({
                    position: exp.position,
                    companyName: exp.companyName,
                    startDate: new Date(exp.startDate),
                    endDate: exp.endDate ? new Date(exp.endDate) : null,
                    isCurrentWork: exp.isCurrentWork,
                })) || [],
            },
            educations: {
                create: data.educations?.map(edu => ({
                    specialty: edu.specialty,
                    institutionName: edu.institutionName,
                    startDate: new Date(edu.startDate),
                    endDate: edu.endDate ? new Date(edu.endDate) : null,
                    isCurrentStudy: edu.isCurrentStudy,
                })) || [],
            },languageSkills: {
                create: data.languageSkills?.map(lang => ({
                    language: lang.language,
                    level: lang.level,
                })) || [],
            },
        },
    })
}

const findResumeByIdAndUserId = async (data: findResumeByIdAndUserIdDto): Promise<Prisma.ResumeGetPayload<{ include: { workExperiences: true; educations: true; languageSkills: true } }> | null> => {
       return prismaClient.resume.findUnique({
            where: {
                id: data.resumeId,
                userId: data.userId,
            },
           include: {
               workExperiences: true,
               educations: true,
               languageSkills: true,
           },
       });
};


const getResumesUserById = async (userId: string): Promise<UserResumeByIdDto[]> => {
    return prismaClient.resume.findMany({
        where: {userId},
        select: {
            id: true,
            skills: true,
            title: true,
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
        },
        include: {
            workExperiences: true,
            educations: true,
            languageSkills: true,
        },
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