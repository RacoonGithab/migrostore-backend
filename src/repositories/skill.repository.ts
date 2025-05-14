import {prismaClient} from "../config/prismaClient";
import {Skill} from "@prisma/client";


const createSkill = async (name: string): Promise<Skill> => {
    return prismaClient.skill.create({data: {name}});
}

const getSkillByName = async (name: string): Promise<Skill | null> => {
    return prismaClient.skill.findUnique({ where: { name } });
}

const getSkillById = async (id: string): Promise<Skill | null> => {
    return prismaClient.skill.findUnique({ where: { id } });
}

const deleteSkillById = async (id: string): Promise<Skill | null> => {
    return prismaClient.skill.delete({where: { id }});
}

export const skillRepository = {
    createSkill,
    getSkillByName,
    getSkillById,
    deleteSkillById
}