import {Request, Response} from "express";
import {cityService} from "../services/city.service";
import {cityRepository} from "../repositories/city.repository";

const createCity = async (req: Request, res: Response) => {
    await cityService.createCity(req.body.name);
    res.status(201).json({ message: "City created" });
}

const deleteCity = async (req: Request, res: Response) => {
    await cityRepository.deleteCityById(req.params.id);
    res.status(204).json({ message: "City deleted successfully" });
}

export const cityController = {
    createCity,
    deleteCity
}