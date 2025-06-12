import {Country} from "@prisma/client";
import {prismaClient} from "../config/prismaClient";


const createCountryByName = async (name: string): Promise<Country> => {
    return prismaClient.country.create({data: {name}});
}

const getCountryById = async (countryId: string): Promise<Country | null> => {
    return prismaClient.country.findUnique({where: {id: countryId}});
}

const getListCountries = async (): Promise<Country[]> => {
    return prismaClient.country.findMany({
        orderBy: {
            name: 'asc',
        },
    });
};

const getCountryByName = async (name: string): Promise<Country | null> => {
    return prismaClient.country.findUnique({where: {name: name}})
}

const deleteCountryById = async (countryId: string): Promise<Country | null> => {
    return prismaClient.country.delete({where: {id: countryId}});
}

export const countryRepository = {
    createCountryByName,
    getCountryById,
    getCountryByName,
    getListCountries,
    deleteCountryById,
}