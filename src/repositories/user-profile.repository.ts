import {createUserProfileDto, updateUserProfileDto} from "../types/dto/user.profile.dto";
import {UserProfile} from "@prisma/client";
import {prismaClient} from "../config/prismaClient";


const createUserProfile = async (data: createUserProfileDto): Promise<UserProfile> => {
    return prismaClient.userProfile.create({data})
}

const getProfileByUserId = async (userId: string): Promise<UserProfile | null> => {
    return prismaClient.userProfile.findUnique(
        {
            where: {userId: userId}
        }
    )
}

const updateUserProfile = async (data: updateUserProfileDto): Promise<UserProfile> => {
    const { userId, ...updateFields } = data;

    return prismaClient.userProfile.update({
        where: {
            userId: data.userId,
        },
        data: {
            ...Object.fromEntries(
                Object.entries(updateFields).filter(([, value]) => value !== undefined)
            ),
            updatedAt: new Date(),
        }
    });
};



export const userProfileRepository = {
    createUserProfile,
    getProfileByUserId,
    updateUserProfile
}