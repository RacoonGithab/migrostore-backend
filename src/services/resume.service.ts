import {CreateResumeDto, findResumeByIdAndUserIdDto, UserResumeByIdDto} from "../types/dto/resume.dto";
import {resumeRepository} from "../repositories/resume.repository";
import ApiError from "../errors/api.error";
import {error} from "../utils/constants/error.masseges";
import {getPdfFileFromStorage} from "../utils/storage/get.pdf.from.storage";
import { Readable } from 'stream';
import {generateResumeFilePath} from "../utils/storage/storage.utils";
import {validateCity} from "./city.service";
import {validateSkills} from "./skill.service";
import {generateResumePdf} from "../utils/generate.resume.pdf";
import {uploadFileToStorage} from "../utils/storage/upload.file.to.storage";


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
            userId: userId,
            city: data.city,
            skills: skillNames,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

    if (!resume || !resume.id) {
        throw new ApiError(404, error.NOT_FOUND);
    }

    const pdfBuffer = await generateResumePdf(data);
    if (!pdfBuffer) {
        throw new ApiError(500, error.INTERNAL_SERVER_ERROR);
    }

    await uploadFileToStorage({ buffer: pdfBuffer, userId: userId, filename: resume.id });
}

const getResumeByIdAndUserId = async (data: findResumeByIdAndUserIdDto): Promise<Readable> => {
    const resumeDb = await resumeRepository.findResumeByIdAndUserId(data);
    if (!resumeDb) {
        throw new ApiError(404, error.NOT_FOUND);
    }

    if (resumeDb.id) {
        const filePath = generateResumeFilePath(data.userId, resumeDb.id);
        return await getPdfFileFromStorage(filePath);
    }
    throw new ApiError(404, error.NOT_FOUND);
};


const getResumesUserById = async (userId: string): Promise<UserResumeByIdDto[]> => {
    const resumeDb = await resumeRepository.getResumesUserById(userId);

    if (!resumeDb) {
        throw new ApiError(404, error.NOT_FOUND);
    }
    return resumeDb;
}

export const resumeService = {
    createResume,
    getResumeByIdAndUserId,
    getResumesUserById
} as const;