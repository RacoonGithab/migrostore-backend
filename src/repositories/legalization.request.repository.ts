import {LegalizationRequest} from "@prisma/client";
import {prismaClient} from "../config/prismaClient";
import {LegalizationRequestDto} from "../types/dto/legalization.request.dto";


const createLegalizationRequestByUserID = async (data: LegalizationRequestDto): Promise<LegalizationRequest> => {
    return prismaClient.legalizationRequest.create({data})
}

const getLegalizationRequestsBuUserId = async (userId: string): Promise<LegalizationRequest[]> => {
    return prismaClient.legalizationRequest.findMany({
        where: {
            userId: userId
        }
    })
}

export const legalizationRequestRepository = {
    createLegalizationRequestByUserID,
    getLegalizationRequestsBuUserId
}