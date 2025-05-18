import {CreateResumeDto, findResumeByIdAndUserIdDto} from "../types/dto/resume.dto";
import {resumeRepository} from "../repositories/resume.repository";
import ApiError from "../errors/api.error";
import {error} from "../utils/constants/error.masseges";
import {getPdfFileFromStorage} from "../utils/storage/get.pdf.from.storage";
import { Readable } from 'stream';
import {generateResumeFilePath} from "../utils/storage/storage.utils";
import {validateCity} from "./city.service";
import {validateSkills} from "./skill.service";
import {generateAndSaveResumePdf} from "./resume.pdf.service";


const createResume = async (data: CreateResumeDto, userId: string): Promise<void> => {

    await validateCity(data.city);

    const skillNames = await validateSkills(data.skills);

    const resume = await resumeRepository.createResume(
        {
            firstName: data.firstName,
            lastName: data.lastName,
            age: data.age,
            education: data.education,
            workExperience: data.workExperience,
            aboutMe: data.aboutMe,
            user: {
                connect: {
                    id: userId,
                },
            },
            city: data.city,
            skills: skillNames,
            createdAt: new Date(),
        });

    if (!resume) {
        throw new ApiError(500, "Failed to create resume in database");
    }

    const pdfFilename = await generateAndSaveResumePdf(data, userId, resume.id);

    if (pdfFilename) {
        await resumeRepository.updateResumePdfFilename(resume.id, pdfFilename);
    }
}

const getResumeById = async (data: findResumeByIdAndUserIdDto): Promise<Readable> => {
    const resumeDb = await resumeRepository.findResumeByIdAndUserId(data);
    if (!resumeDb) {
        throw new ApiError(404, error.NOT_FOUND);
    }

    if (resumeDb.pdfFilename) {
        const filePath = generateResumeFilePath(data.userId, resumeDb.pdfFilename);
        return await getPdfFileFromStorage(filePath);
    }
    throw new ApiError(404, error.NOT_FOUND);
};

export const resumeService = {
    createResume,
    getResumeById
} as const;