import {Request, Response} from "express";
import {skillService} from "../services/skill.service";
import {skillRepository} from "../repositories/skill.repository";

const createSkill = async (req: Request, res: Response) => {
    const {userId} = req.params;
    const {name} = req.body;
    await skillService.createSkill({name, userId});
    res.status(201).send({message: "Skill created successfully."});
}

const getSkill = async (req: Request, res: Response) => {
    const {userId, skillId} = req.params;
    const skill = await skillService.getSkill({userId, skillId});
    res.status(200).json(skill)
}

const getListSkills = async (req: Request, res: Response) => {
    const {userId} = req.params;
    const listSkillsDb = await skillService.getListSkills(userId);
    res.status(200).json(listSkillsDb)
}

const deleteSkill = async (req: Request, res: Response) => {
    const {skillId, userId} = req.params;
    await skillService.deleteSkill({skillId, userId})
    res.status(204).send({message: "Skill deleted successfully."});
}


export const skillController = {
    createSkill,
    getSkill,
    getListSkills,
    deleteSkill
}