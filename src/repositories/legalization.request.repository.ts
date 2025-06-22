import {LegalizationRequest} from "@prisma/client";
import {prismaClient} from "../config/prismaClient";
import {
    deleteLegalizationRequestDto,
    getLegalizationRequestDto,
    LegalizationRequestDto
} from "../types/dto/legalization.request.dto";


const createLegalizationRequest = async (data: LegalizationRequestDto): Promise<LegalizationRequest> => {
    return prismaClient.legalizationRequest.create({data})
}

const getListLegalizationRequestsByUserId = async (userId: string): Promise<LegalizationRequest[]> => {
    return prismaClient.legalizationRequest.findMany({
        where: {
            userId: userId
        }
    })
}

const getLegalizationRequestsById = async (data: getLegalizationRequestDto): Promise<LegalizationRequest | null> => {
    return prismaClient.legalizationRequest.findUnique({
        where: {
            userId: data.userId,
            id: data.legalizationRequestId
        }
    })
}

const deleteLegalizationRequestsById = async (data: deleteLegalizationRequestDto): Promise<LegalizationRequest | null> => {
    return prismaClient.legalizationRequest.delete({
        where: {
            userId: data.userId,
            id: data.legalizationRequestId
        }
    })
}

export const legalizationRequestRepository = {
    createLegalizationRequest,
    getListLegalizationRequestsByUserId,
    getLegalizationRequestsById,
    deleteLegalizationRequestsById
}