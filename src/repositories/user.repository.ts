import {prismaClient} from "../config/prismaClient";
import {User} from "@prisma/client";
import {CreateUserDto} from "../types/users.dto";

const createUser = async (data: CreateUserDto): Promise<User> => {
    return prismaClient.user.create({
        data: {
            ...data,
        }
    });
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

export const usersRepository = {
    createUser,
    getUserByEmail,
    updateUserByEmail
} as const;