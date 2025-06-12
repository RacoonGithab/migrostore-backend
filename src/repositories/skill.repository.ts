import {prismaClient} from "../config/prismaClient";
import {Skill} from "@prisma/client";


const createSkillByName = async (name: string): Promise<Skill> => {
    return prismaClient.skill.create({data: {name}});
}

const getSkillByName = async (name: string): Promise<Skill | null> => {
    return prismaClient.skill.findUnique({ where: { name } });
}

export const getSkillsByNames = async (names: string[]): Promise<Skill[]> => {
    return prismaClient.skill.findMany({
        where: {
            name: {
                in: names,
            },
        },
    });
};

const getListSkills = async (): Promise<Skill[]> => {
    return prismaClient.skill.findMany({
        orderBy: {
            name: 'asc',
        },
    });
};

const getSkillById = async (skillId: string): Promise<Skill | null> => {
    return prismaClient.skill.findUnique({ where: { id: skillId } });
}

const deleteSkillById = async (id: string): Promise<Skill | null> => {
    return prismaClient.skill.delete({where: { id }});
}

export const skillRepository = {
    createSkillByName,
    getSkillsByNames,
    getSkillById,
    getListSkills,
    deleteSkillById,
    getSkillByName
}