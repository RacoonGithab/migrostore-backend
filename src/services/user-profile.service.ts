import {UserProfile} from "@prisma/client";
import {createUserProfileDto, updateUserProfileDto} from "../types/dto/user.profile.dto";
import {usersRepository} from "../repositories/user.repository";
import ApiError from "../errors/api.error";
import {error} from "../utils/constants/error.masseges";
import {userProfileRepository} from "../repositories/user-profile.repository";

const createUserProfile = async (data: createUserProfileDto, userId: string): Promise<UserProfile> => {
    const userDb = await usersRepository.getUserById(userId)

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (!userDb.isVerified) {
        throw new ApiError(403, error.EMAIL_NOT_VERIFIED);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    return userProfileRepository.createUserProfile(
        {
            firstName: data.firstName,
            lastName: data.lastName,
            dateOfBirth: data.dateOfBirth,
            email: data.email,
            country: data.country,
            entryBasis: data.entryBasis,
            citiesForJob: data.citiesForJob,
            polishLanguageLevel: data.polishLanguageLevel,
            englishLanguageLevel: data.englishLanguageLevel,
            skills: data.skills,
            userId: userId,
        }
    );
}

const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    const userDb = await usersRepository.getUserById(userId)

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (!userDb.isVerified) {
        throw new ApiError(403, error.EMAIL_NOT_VERIFIED);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    const userProfileDb = await userProfileRepository.getProfileByUserId(userId);

    if (!userProfileDb) {
        throw new ApiError(404, error.NOT_FOUND);
    }

    return userProfileDb;
}

const updateUserProfile = async (data: updateUserProfileDto, userId: string): Promise<UserProfile> => {
    const userDb = await usersRepository.getUserById(userId)

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (!userDb.isVerified) {
        throw new ApiError(403, error.EMAIL_NOT_VERIFIED);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    return userProfileRepository.updateUserProfile(
        {
            firstName: data.firstName,
            lastName: data.lastName,
            dateOfBirth: data.dateOfBirth,
            email: data.email,
            country: data.country,
            entryBasis: data.entryBasis,
            citiesForJob: data.citiesForJob,
            polishLanguageLevel: data.polishLanguageLevel,
            englishLanguageLevel: data.englishLanguageLevel,
            skills: data.skills,
            userId: userId,
        },
    )
}

export const userProfileService = {
    createUserProfile,
    getUserProfile,
    updateUserProfile
}