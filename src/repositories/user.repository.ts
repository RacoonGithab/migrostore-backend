import {prismaClient} from "../config/prismaClient";
import {User} from "@prisma/client";

const createUser = async (data: {
    email: string,
    password: string,
    updatedAt: Date,
    createdAt: Date,
}): Promise<User> => {
    return prismaClient.user.create({
        data: {
            ...data,
        }
    });
}

const getByEmail = async (email: string): Promise<User | null> => {
    return prismaClient.user.findUnique({
        where: {
            email: email
        }
    })
}

export const usersRepository = {
    createUser,
    getByEmail
} as const;