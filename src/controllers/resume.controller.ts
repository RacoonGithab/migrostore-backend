import {Request, Response} from "express";


const createResume = async (req: Request, res: Response) => {
    res.status(201).json({ message: "Resume created" });
}


export const resumeController = {
    createResume,
}