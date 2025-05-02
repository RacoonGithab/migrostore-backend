import {Session} from "@prisma/client";
import {prismaClient} from "../config/prismaClient";
import {CreateSessionDto} from "../types/session.dto";


const createSession = async (data: CreateSessionDto): Promise<Session> => {
    return prismaClient.session.create({data});
}

const findActiveSessionByUserId = async (userId: string): Promise<Session | null> => {
    return prismaClient.session.findFirst({
        where: {
            userId: userId,
            expiredAt: {
                gt: new Date(),
            },
        },
    });
}

export const sessionsRepository = {
    createSession,
    findActiveSessionByUserId
}