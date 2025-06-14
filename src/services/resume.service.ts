import {
    CreateResumeDto,
    findResumeByIdAndUserIdDto, UpdateResumeDto,
    UserResumeByIdDto
} from "../types/dto/resume.dto";
import {resumeRepository} from "../repositories/resume.repository";
import ApiError from "../errors/api.error";
import {error} from "../utils/constants/error.masseges";
import {generateResumePdf} from "../utils/generate.resume.pdf";
import {uploadFileToStorage} from "../utils/storage/upload.file.to.storage";
import {usersRepository} from "../repositories/user.repository";
import {deleteFileFromStorage} from "../utils/storage/delete.file.from.storage";
import {generateFileName} from "../utils/storage/generate.file.name";
import {redisConstants} from "../utils/constants/redis.constants";
import {checkAndIncrementDailyResumeCount} from "../utils/redis.resume.util";
import {env} from "../config/secrets";
import {Resume} from "@prisma/client";


const createResume = async (
    data: CreateResumeDto,
    userId: string,
    file?: Express.Multer.File
): Promise<UserResumeByIdDto[]> => {
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

    if (userResumes.length >= env.MAX_TOTAL_RESUMES) {
        throw new ApiError(429, error.RESUME_LIMIT_EXCEEDED_TOTAL);
    }

    const currentDailyCount = await checkAndIncrementDailyResumeCount(userId);

    if (currentDailyCount > redisConstants.DAILY_RESUME_LIMIT) {
        throw new ApiError(429, error.TOO_MANY_REQUESTS_DAILY);
    }


    if (file) {
        data.photo = await uploadFileToStorage({
            buffer: file.buffer,
            resumeName: data.title,
            filename: file.originalname,
            userId: userId,
            contentType: file.mimetype
        });
    }

    const resume = await resumeRepository.createResume(
        {
            title: data.title,
            email: data.email,
            phoneNumber: data.phoneNumber,
            firstName: data.firstName,
            lastName: data.lastName,
            photo: data.photo,
            dateOfBirth: new Date(data.dateOfBirth),
            country: data.country,
            aboutMe: data.aboutMe,
            skills: data.skills,
            qualification: data.qualification,
            userId: userId,

            workExperiences: data.workExperiences,
            educations: data.educations,
            languageSkills: data.languageSkills,
        });

    if (!resume || !resume.id) {
        throw new ApiError(500, error.INTERNAL_SERVER_ERROR);
    }

    return resumeRepository.getResumesUserById(userId);
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

// const updateResume = async (
//     data: UpdateResumeDto,
//     resumeId: string,
//     userId: string,
//     file?: Express.Multer.File
// ): Promise<{ buffer: Buffer, filename: string }> => {
//     const { clearPhoto, ...updateFields } = data;
//
//     const userDb = await usersRepository.getUserById(userId);
//
//     if (!userDb) {
//         throw new ApiError(404, error.USER_NOT_FOUND);
//     }
//
//     if (!userDb.isVerified) {
//         throw new ApiError(401, error.EMAIL_NOT_VERIFIED);
//     }
//
//     if (userDb.isBlocked) {
//         throw new ApiError(403, error.USER_BLOCKED);
//     }
//
//     const resumeDb = await resumeRepository.findResumeByIdAndUserId({ userId, resumeId });
//
//     if (!resumeDb) {
//         throw new ApiError(404, error.NOT_FOUND);
//     }
//
//     if (file) {
//         updateFields.photo = await uploadFileToStorage({
//             buffer: file.buffer,
//             resumeName: resumeDb.title,
//             filename: file.originalname,
//             userId: userId,
//             contentType: file.mimetype
//         });
//     }
//
//     if (clearPhoto && resumeDb.photo) {
//         await deleteFileFromStorage(resumeDb.photo);
//         updateFields.photo = null;
//     }
//
//
//     const updatedResumeDb = await resumeRepository.updateResumeById(
//         {
//             userId,
//             resumeId,
//             ...updateFields
//         }
//     )
//
//     if (!updatedResumeDb) {
//         throw new ApiError(500, error.INTERNAL_SERVER_ERROR);
//     }
//
//     const pdfBuffer = await generateResumePdf(updatedResumeDb);
//
//     if (!pdfBuffer) {
//         throw new ApiError(500, error.INTERNAL_SERVER_ERROR);
//     }
//
//     const suggestedFileName = generateFileName({firstName: updatedResumeDb.firstName, lastName: updatedResumeDb.lastName});
//
//     return { buffer: pdfBuffer, filename: suggestedFileName };
// }

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
    // updateResume,
    deleteResume
} as const;