import {Request, Response} from "express";
import {skillService} from "../services/skill.service";
import {skillRepository} from "../repositories/skill.repository";

const createSkill = async (req: Request, res: Response) => {
    const {userId} = req.params;
    const {name} = req.body;
    await skillService.createSkill({name, userId});
    res.status(201).send({message: "Skill created successfully."});
}

const deleteSkill = async (req: Request, res: Response) => {
    const {skillId, userId} = req.params;
    await skillService.deleteSkill({skillId, userId})
    res.status(204).send({message: "Skill deleted successfully."});
}


export const skillController = {
    createSkill,
    deleteSkill
}