import {Request, Response} from "express";
import {legalizationRequestService} from "../services/legalization.request.service";

const createLegalizationRequest = async (req: Request, res: Response) => {
    const {userId} = req.params

    const legalizationRequestData = req.body

    await legalizationRequestService.createLegalizationRequest(legalizationRequestData, userId)

    res.status(201).json({message:"Request was successfully reset"})
}

const getListLegalizationRequests = async (req: Request, res: Response) => {
    const {userId} = req.params

    const listLegalizationRequests = await legalizationRequestService.getListLegalizationRequests(userId)

    res.status(200).json(listLegalizationRequests)
}

const getLegalizationRequest = async (req: Request, res: Response) => {
    const {userId, legalizationRequestId} = req.params

    const legalizationRequests = await legalizationRequestService.getLegalizationRequest({userId, legalizationRequestId})

    res.status(200).json(legalizationRequests)
}

const deleteLegalizationRequest = async (req: Request, res: Response) => {
    const {userId, legalizationRequestId} = req.params

    await legalizationRequestService.deleteLegalizationRequest({userId, legalizationRequestId})

    res.status(204).json()
}

export const legalizationRequestController = {
    createLegalizationRequest,
    getListLegalizationRequests,
    getLegalizationRequest,
    deleteLegalizationRequest
}