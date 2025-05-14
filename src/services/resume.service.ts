import {CreateResumeDto} from "../types/dto/resume.dto";
import {cityRepository} from "../repositories/city.repository";
import {skillRepository} from "../repositories/skill.repository";
import {resumeRepository} from "../repositories/resume.repository";
import ApiError from "../errors/api.error";
import {error} from "../utils/constants/error.masseges";


const createResume = async (data: CreateResumeDto, userId: string): Promise<void> => {
    if (data.city) {
        const cityExist = await cityRepository.getCityByName(data.city);
        if (!cityExist) {
            throw new ApiError(404, error.NOT_CITY_EXISTS)
        }
    }

    const skillIds: string[] = [];
    for (const skillName of data.skills) {
        const skill = await skillRepository.getSkillByName(skillName);
        if (!skill) {
            throw new ApiError(404, error.NOT_SKILL_EXISTS);
        }
        skillIds.push(skill.id);
    }

    await resumeRepository.createResume({
        firstName: data.firstName,
        lastName: data.lastName,
        age: data.age,
        education: data.education,
        workExperience: data.workExperience,
        aboutMe: data.aboutMe,
        user: {
            connect: {
                id: userId,
            },
        },
        city: data.city,
        skills: skillIds,
        photo: data.photo,
        pdfUrl: data.pdfUrl,
        createdAt: new Date(),
    });
};

export const resumeService = {
    createResume,
} as const;