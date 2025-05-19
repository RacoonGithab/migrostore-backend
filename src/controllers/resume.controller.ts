import {Request, Response} from "express";
import {resumeService} from "../services/resume.service";


const createResume = async (req: Request, res: Response) => {
    const {userId} = req.params;
    await resumeService.createResume(req.body, userId);
    res.status(201).json({message: "Resume created successfully"});
}

const getResumeByIdAndUserId = async (req: Request, res: Response) => {
    const { resumeId, userId } = req.params;

    const fileStream = await resumeService.getResumeByIdAndUserId({userId, resumeId});

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="resume-${resumeId}.pdf"`); // або attachment; для збереження

    fileStream.pipe(res);
}


const getUserResumesById = async (req: Request, res: Response) => {
    const resumes = await resumeService.getResumesUserById(req.params.userId)
    res.status(200).json(resumes);
}


export const resumeController = {
    createResume,
    getResumeByIdAndUserId,
    getUserResumesById
}