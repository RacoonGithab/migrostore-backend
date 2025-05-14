import {Request, Response} from "express";
import {skillService} from "../services/skill.service";
import {skillRepository} from "../repositories/skill.repository";

const createSkill = async (req: Request, res: Response) => {
    await skillService.createSkill(req.body.name);
    res.status(201).send({message: "Skill created successfully."});
}

const deleteSkill = async (req: Request, res: Response) => {
    await skillRepository.deleteSkillById(req.params.id)
    res.status(204).send({message: "Skill deleted successfully."});
}


export const skillController = {
    createSkill,
    deleteSkill
}