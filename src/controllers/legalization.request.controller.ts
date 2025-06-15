import {Request, Response} from "express";
import {legalizationRequestService} from "../services/legalization.request.service";

const createLegalizationRequest = async (req: Request, res: Response) => {
    const {userId} = req.params

    const legalizationRequestData = req.body

    await legalizationRequestService.createLegalizationRequest(legalizationRequestData, userId)

    res.status(201).json({message:"Request was successfully reset"})
}


export const legalizationRequestController = {
    createLegalizationRequest
}