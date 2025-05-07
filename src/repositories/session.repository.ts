import {Session} from "@prisma/client";
import {prismaClient} from "../config/prismaClient";
import {CreateSessionDto, RefreshTokenSessionDto, UpdateSessionDto} from "../types/dto/session.dto";


const createSession = async (data: CreateSessionDto): Promise<Session> => {
    return prismaClient.session.create({data});
}

const findActiveSessionByUserId = async (userId: string): Promise<Session | null> => {
    return prismaClient.session.findFirst({
        where: {
            userId: userId,
            isActive: true,
        },
    });
}


const deactivationSession = async (data: UpdateSessionDto): Promise<void> => {
    await prismaClient.session.update({
        where: {
            id: data.id,
        },
        data: {
            isActive: data.isActive,
            updatedAt: data.updatedAt,
        }
    })
}

const updateSession = async (data: RefreshTokenSessionDto): Promise<void> => {
    await prismaClient.session.update({
        where: {
            id: data.id,
        },
        data: {
            isActive: data.isActive,
            updatedAt: data.updatedAt,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
        },
    });
};




export const sessionsRepository = {
    createSession,
    findActiveSessionByUserId,
    deactivationSession,
    updateSession
}