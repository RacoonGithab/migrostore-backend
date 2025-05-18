import {Request, Response} from "express";
import {resumeService} from "../services/resume.service";


const createResume = async (req: Request, res: Response) => {
    const {userId} = req.params;
    await resumeService.createResume(req.body, userId);
    res.status(201).json({message: "Resume created successfully"});
}

const getResumeById = async (req: Request, res: Response) => {
    const { resumeId, userId } = req.params;

    const fileStream = await resumeService.getResumeById({userId, resumeId});

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="resume-${resumeId}.pdf"`); // або attachment; для збереження

    fileStream.pipe(res);
}


export const resumeController = {
    createResume,
    getResumeById
}