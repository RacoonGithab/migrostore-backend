import {prismaClient} from "../config/prismaClient";
import {User} from "@prisma/client";
import {CreateUserDto, UpdateUserPasswordDto} from "../types/dto/users.dto";

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

const getUserById = async (id: string): Promise<User | null> => {
    return prismaClient.user.findUnique({
        where: {
            id: id,
        },
    });
};

const deleteUserById = async (id: string): Promise<void> => {
    await prismaClient.user.delete({where: {id: id}});
}

const updateUserPassword = async (data: UpdateUserPasswordDto): Promise<void> => {
    await prismaClient.user.update({
        where: {
            id: data.userId
        },
        data: {
            password: data.newPassword,
        },
    });
};

export const usersRepository = {
    createUser,
    getUserByEmail,
    updateUserByEmail,
    getUserById,
    deleteUserById,
    updateUserPassword
} as const;