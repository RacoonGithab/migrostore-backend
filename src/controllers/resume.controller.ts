import {Request, Response} from "express";
import {resumeService} from "../services/resume.service";


const createResume = async (req: Request, res: Response) => {
    const {userId} = req.params;
    await resumeService.createResume(req.body, userId);
    res.status(201).json({ message: "Resume created" });
}


export const resumeController = {
    createResume,
}