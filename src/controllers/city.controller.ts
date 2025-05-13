import {Request, Response} from "express";
import {cityRepository} from "../repositories/city.repository";

const createCity = async (req: Request, res: Response) => {
    const { name } = req.body;
    await cityRepository.createCity(name);
    res.status(201).json({ message: "City created" });
}
export const cityController = {
    createCity,
}