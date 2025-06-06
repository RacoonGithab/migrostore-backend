import ApiError from "../errors/api.error";
import {skillRepository} from "../repositories/skill.repository";
import {Skill} from "@prisma/client";
import {error} from "../utils/constants/error.masseges";
import {CreateSkillDto, DeleteSkillDto} from "../types/dto/skills.dto";
import {usersRepository} from "../repositories/user.repository";


const createSkill = async (data: CreateSkillDto): Promise<void> => {
    const userDb = await usersRepository.getUserById(data.userId);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (!userDb.isVerified) {
        throw new ApiError(403, error.EMAIL_NOT_VERIFIED)
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    const skillDb = await skillRepository.getSkillByName(data.name);

    if (skillDb) {
        throw new ApiError(409, `Skill '${data.name}' already exists`);
    }

    await skillRepository.createSkillByName(data.name)
}


const deleteSkill = async (data: DeleteSkillDto): Promise<void> => {
    const userDb = await usersRepository.getUserById(data.userId);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (!userDb.isVerified) {
        throw new ApiError(403, error.EMAIL_NOT_VERIFIED)
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    const skillDb = await skillRepository.getSkillById(data.skillId);

    if (!skillDb) {
        throw new ApiError(409, `Skill '${data.skillId}' not exists`);
    }

    await skillRepository.deleteSkillById(data.skillId)
}


export const validateSkills = async (skillNames: string[]): Promise<string[]> => {
    const skills: Skill[] = await skillRepository.getSkillsByNames(skillNames);
    if (skills.length !== skillNames.length) {
        throw new ApiError(404, error.NOT_SKILL_EXISTS);
    }
    return skills.map(skill => skill.name); // <--- Возвращаем names
};


export const skillService = {
    createSkill,
    deleteSkill,
    validateSkills
} as const;