import {Request, Response} from "express";
import {resumeService} from "../services/resume.service";
import {UpdateResumeDto} from "../types/dto/resume.dto";


const createResume = async (req: Request, res: Response) => {
    const {userId} = req.params;
    const { buffer, filename } = await resumeService.createResume(req.body, userId, req.file);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="CV-${filename}.pdf"`);

    res.send(buffer);
}

const getUserResume = async (req: Request, res: Response) => {
    const { resumeId, userId } = req.params;

    const { buffer, filename } = await resumeService.getUserResume({userId, resumeId});

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="CV-${filename}.pdf"`);

    res.send(buffer);
}


const getListUserResume = async (req: Request, res: Response) => {
    const resumes = await resumeService.getListUserResume(req.params.userId)
    res.status(200).json(resumes);
}

const updateResume = async (req: Request, res: Response) => {
    const {userId, resumeId} = req.params;

    const updateData: UpdateResumeDto = req.body;

    const { buffer, filename } = await resumeService.updateResume(
        updateData,
        resumeId,
        userId,
        req.file
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="CV-${encodeURIComponent(filename)}.pdf"`);

    res.send(buffer);
}

const deleteResume = async (req: Request, res: Response) => {
    const {userId, resumeId} = req.params;

    await resumeService.deleteResume({userId, resumeId});

    res.status(204).json();
}


export const resumeController = {
    createResume,
    getUserResume,
    getListUserResume,
    updateResume,
    deleteResume
}