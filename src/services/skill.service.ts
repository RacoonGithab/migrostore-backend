import ApiError from "../errors/api.error";
import {skillRepository} from "../repositories/skill.repository";


const createSkill = async (name: string): Promise<void> => {
    const skillDb = await skillRepository.getSkillByName(name);

    if (skillDb) {
        throw new ApiError(409, `Skill '${name}' already exists`);
    }

    await skillRepository.createSkill(name)
}


export const skillService = {
    createSkill,
} as const;