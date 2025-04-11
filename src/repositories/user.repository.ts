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