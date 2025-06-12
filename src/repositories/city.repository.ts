import {City, Country} from "@prisma/client";
import {prismaClient} from "../config/prismaClient";


const createCity = async (name: string): Promise<City> => {
    return prismaClient.city.create({data: {name}});
}

const getCityById = async (id: string): Promise<City | null> => {
    return prismaClient.city.findUnique({where: {id}});
}

const getCityByName = async (name: string): Promise<City | null> => {
    return prismaClient.city.findUnique({where: {name}})
}

const getListCity = async (): Promise<City[]> => {
    return prismaClient.city.findMany({
        orderBy: {
            name: 'asc',
        },
    });
};

const deleteCityById = async (id: string): Promise<City | null> => {
    return prismaClient.city.delete({where: {id}});
}

export const cityRepository = {
    createCity,
    getCityById,
    getCityByName,
    getListCity,
    deleteCityById
}