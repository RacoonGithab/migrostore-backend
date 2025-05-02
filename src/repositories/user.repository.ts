import {prismaClient} from "../config/prismaClient";
import {User} from "@prisma/client";
import {CreateUserDto, updateUserActivityStatusDto} from "../types/users.dto";

const createUser = async (data: CreateUserDto): Promise<User> => {
    return prismaClient.user.create({data});
}

const getUserByEmail = async (email: string): Promise<User | null> => {
    return prismaClient.user.findUnique({
        where: {
            email: email
        }
    })
}

const updateUserByEmail = async (data: {
    email: string,
    updatedAt: Date,
}): Promise<void> => {
    await prismaClient.user.update({
        where: {
            email: data.email,
        },
        data: {
            isVerified: true,
            updatedAt: data.updatedAt,
        }
    });
}

const updateUserActivityStatus = async (data: updateUserActivityStatusDto): Promise<User> => {
    return prismaClient.user.update({
        where: {
            id: data.userId,
        },
        data: {
            isActive: data.isActive
        },
    });
}


export const usersRepository = {
    createUser,
    getUserByEmail,
    updateUserByEmail,
    updateUserActivityStatus
} as const;