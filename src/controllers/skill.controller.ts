import {Request, Response} from "express";

const createSkill = async (req: Request, res: Response) => {
    res.status(200).send({message: "Skill created successfully."});
}

export const skillController = {
    createSkill,
}