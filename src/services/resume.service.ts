import {CreateResumeDto} from "../types/dto/resume.dto";
import {cityRepository} from "../repositories/city.repository";
import {skillRepository} from "../repositories/skill.repository";
import {resumeRepository} from "../repositories/resume.repository";
import {Resume} from "@prisma/client";


const createResume = async (data: CreateResumeDto, userId: string): Promise<Resume | Error> => {
    if (data.city) {
        const cityExist = await cityRepository.getCityByName(data.city);
        if (!cityExist) {
            throw new Error(`City "${data.city}" not found.`)
        }
    }

    const skillIds: string[] = [];
    for (const skillName of data.skills) {
        const skill = await skillRepository.getSkillByName(skillName);
        if (!skill) {
            throw new Error(`Skill "${skillName}" not found.`);
        }
        skillIds.push(skill.id);
    }

    const resume = await resumeRepository.createResume({
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

    return resume;
};