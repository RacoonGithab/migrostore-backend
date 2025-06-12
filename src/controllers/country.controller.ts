import {Response, Request} from "express";
import {countryService} from "../services/country.service";

const createCountry = async (req: Request, res: Response) => {
    const {userId} = req.params;
    const {name} = req.body;
    await countryService.createCountry({name, userId});
    res.status(201).send({message: "Country successfully created"});
}

const getCountry = async (req: Request, res: Response) => {
    const {userId, countryId} = req.params;
    const country = await countryService.getCountry({userId, countryId});
    res.status(200).json(country)
}

const getListCountries = async (req: Request, res: Response) => {
    const {userId} = req.params;
    const listCountries = await countryService.getListCountries(userId);
    res.status(200).json(listCountries)
}

const deleteCountry = async (req: Request, res: Response) => {
    const {userId, countryId} = req.params;
    await countryService.deleteCountry({userId, countryId});
    res.status(204).send({message: "Country successfully deleted"});
}

export const countryController = {
    createCountry,
    getCountry,
    getListCountries,
    deleteCountry,
};