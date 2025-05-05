import {Session} from "@prisma/client";
import {prismaClient} from "../config/prismaClient";
import {CreateSessionDto, UpdateSessionDto} from "../types/session.dto";


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

const updateSession = async (data: UpdateSessionDto): Promise<void> => {
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

export const sessionsRepository = {
    createSession,
    findActiveSessionByUserId,
    updateSession
}