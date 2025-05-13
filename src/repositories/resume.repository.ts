import {Resume} from "@prisma/client";
import {prismaClient} from "../config/prismaClient";
import {ResumeCreateInput} from "../types/resume.type";


const createResume = async (data: ResumeCreateInput): Promise<Resume> => {
    return prismaClient.resume.create({data})
};


export const resumeRepository = {
    createResume
}