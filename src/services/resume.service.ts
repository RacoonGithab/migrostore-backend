import {
    CreateResumeDto,
    findResumeByIdAndUserIdDto, UpdateResumeDto,
    UserResumeByIdDto
} from "../types/dto/resume.dto";
import {resumeRepository} from "../repositories/resume.repository";
import ApiError from "../errors/api.error";
import {error} from "../utils/constants/error.masseges";
import {validateCity} from "./city.service";
import {validateSkills} from "./skill.service";
import {generateResumePdf} from "../utils/generate.resume.pdf";
import {uploadFileToStorage} from "../utils/storage/upload.file.to.storage";
import {usersRepository} from "../repositories/user.repository";
import { v4 as uuidv4 } from 'uuid';
import {deleteFileFromStorage} from "../utils/storage/delete.file.from.storage";
import {generateFileName} from "../utils/storage/generate.file.name";
import {MAX_TOTAL_RESUMES} from "../utils/constants/resume.constants";
import {redisConstants} from "../utils/constants/redis.constants";
import {checkAndIncrementDailyResumeCount} from "../utils/redis.resume.util";


const createResume = async (
    data: CreateResumeDto,
    userId: string,
    file?: Express.Multer.File
): Promise<{ buffer: Buffer, filename: string }> => {
    const userDb = await usersRepository.getUserById(userId);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (!userDb.isVerified) {
        throw new ApiError(401, error.EMAIL_NOT_VERIFIED);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED)
    }

    const userResumes = await resumeRepository.getResumesUserById(userId);

    if (userResumes.length >= MAX_TOTAL_RESUMES) {
        throw new ApiError(429, error.RESUME_LIMIT_EXCEEDED_TOTAL);
    }

    const currentDailyCount = await checkAndIncrementDailyResumeCount(userId);

    if (currentDailyCount > redisConstants.DAILY_RESUME_LIMIT) {
        throw new ApiError(429, error.TOO_MANY_REQUESTS_DAILY);
    }

    await validateCity(data.city);

    const skillNames = await validateSkills(data.skills);

    const newResumeId = uuidv4();

    let photoPathInStorage: string | undefined;

    if (file) {
        photoPathInStorage = await uploadFileToStorage({
            buffer: file.buffer,
            resumeId: newResumeId,
            filename: file.originalname,
            userId: userId,
            contentType: file.mimetype
        });
    }

    const resume = await resumeRepository.createResume(
        {
            id: newResumeId,
            firstName: data.firstName,
            lastName: data.lastName,
            age: data.age,
            education: data.education,
            workExperience: data.workExperience,
            aboutMe: data.aboutMe,
            userId: userId,
            city: data.city,
            skills: skillNames,
            photo: photoPathInStorage,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

    if (!resume || !resume.id) {
        throw new ApiError(500, error.INTERNAL_SERVER_ERROR);
    }


    const pdfBuffer = await generateResumePdf(resume);

    if (!pdfBuffer) {
        throw new ApiError(500, error.INTERNAL_SERVER_ERROR);
    }

    const suggestedFileName = generateFileName({firstName: data.firstName, lastName: data.lastName});

    return {buffer: pdfBuffer, filename: suggestedFileName};
}

const getUserResume = async (data: findResumeByIdAndUserIdDto): Promise<{ buffer: Buffer, filename: string }> => {
    const userDb = await usersRepository.getUserById(data.userId);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (!userDb.isVerified) {
        throw new ApiError(401, error.EMAIL_NOT_VERIFIED);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED)
    }


    const resumeDb = await resumeRepository.findResumeByIdAndUserId(data);

    if (!resumeDb) {
        throw new ApiError(404, error.NOT_FOUND);
    }

    const pdfBuffer = await generateResumePdf(resumeDb);

    if (!pdfBuffer) {
        throw new ApiError(500, error.INTERNAL_SERVER_ERROR);
    }

    const suggestedFileName = generateFileName({firstName: resumeDb.firstName, lastName: resumeDb.lastName});

    return {buffer: pdfBuffer, filename: suggestedFileName};
};


const getListUserResume = async (userId: string): Promise<UserResumeByIdDto[]> => {
    const userDb = await usersRepository.getUserById(userId);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (!userDb.isVerified) {
        throw new ApiError(401, error.EMAIL_NOT_VERIFIED);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED)
    }

    const resumeDb = await resumeRepository.getResumesUserById(userId);

    if (!resumeDb) {
        throw new ApiError(404, error.NOT_FOUND);
    }
    return resumeDb;
}

const updateResume = async (
    data: UpdateResumeDto,
    resumeId: string,
    userId: string,
    file?: Express.Multer.File
): Promise<{ buffer: Buffer, filename: string }> => {
    const { ...updateFields } = data;

    const userDb = await usersRepository.getUserById(userId);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (!userDb.isVerified) {
        throw new ApiError(401, error.EMAIL_NOT_VERIFIED);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    if (updateFields.city !== undefined) {
        await validateCity(updateFields.city);
    }

    if (updateFields.skills !== undefined) {
        updateFields.skills = await validateSkills(updateFields.skills);
    }

    const resumeDb = await resumeRepository.findResumeByIdAndUserId({ userId, resumeId });

    if (!resumeDb) {
        throw new ApiError(404, error.NOT_FOUND);
    }

    if (file) {
        updateFields.photo = await uploadFileToStorage({
            buffer: file.buffer,
            resumeId: resumeId,
            filename: file.originalname,
            userId: userId,
            contentType: file.mimetype
        });
    }

    const updatedResumeDb = await resumeRepository.updateResumeById(
        {
            userId,
            resumeId,
            ...updateFields
        }
    )

    if (!updatedResumeDb) {
        throw new ApiError(500, error.INTERNAL_SERVER_ERROR);
    }

    const pdfBuffer = await generateResumePdf(updatedResumeDb);

    if (!pdfBuffer) {
        throw new ApiError(500, error.INTERNAL_SERVER_ERROR);
    }

    const suggestedFileName = generateFileName({firstName: updatedResumeDb.firstName, lastName: updatedResumeDb.lastName});

    return { buffer: pdfBuffer, filename: suggestedFileName };
}

const deleteResume = async (data: findResumeByIdAndUserIdDto): Promise<void> => {
    const userDb = await usersRepository.getUserById(data.userId);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (!userDb.isVerified) {
        throw new ApiError(401, error.EMAIL_NOT_VERIFIED);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    const resumeDb = await resumeRepository.findResumeByIdAndUserId({userId: data.userId, resumeId: data.resumeId});

    if (!resumeDb) {
        throw new ApiError(404, error.NOT_FOUND);
    }

    if (resumeDb.photo) {
        await deleteFileFromStorage(resumeDb.photo)
    }

    await resumeRepository.deleteResumeById({ userId: data.userId, resumeId: data.resumeId });
}

export const resumeService = {
    createResume,
    getUserResume,
    getListUserResume,
    updateResume,
    deleteResume
} as const;