import {Request, Response} from "express";
import {cityService} from "../services/city.service";

const createCity = async (req: Request, res: Response) => {
    const {userId} = req.params;
    const {name} = req.body;
    await cityService.createCity({name, userId});
    res.status(201).json({ message: "City created" });
}

const getListCities = async (req: Request, res: Response) => {
    const {userId} = req.params;
    const listCity = await cityService.getListCities(userId);
    res.status(200).json(listCity);
}

const getCity = async (req: Request, res: Response) => {
    const {userId, cityId} = req.params;
    const city = await cityService.getCity({userId, cityId});
    res.status(200).json(city);
}

const deleteCity = async (req: Request, res: Response) => {
    const {userId, cityId} = req.params;
    await cityService.deleteCity({userId, cityId});
    res.status(204).json({ message: "City deleted successfully" });
}

export const cityController = {
    createCity,
    deleteCity,
    getCity,
    getListCities
}