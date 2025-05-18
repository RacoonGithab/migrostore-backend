import ApiError from "../errors/api.error";
import {skillRepository} from "../repositories/skill.repository";
import {Skill} from "@prisma/client";
import {error} from "../utils/constants/error.masseges";


const createSkill = async (name: string): Promise<void> => {
    const skillDb = await skillRepository.getSkillByName(name);

    if (skillDb) {
        throw new ApiError(409, `Skill '${name}' already exists`);
    }

    await skillRepository.createSkill(name)
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
    validateSkills
} as const;