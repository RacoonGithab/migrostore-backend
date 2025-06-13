import {cityRepository} from "../repositories/city.repository";
import ApiError from "../errors/api.error";
import {error} from "../utils/constants/error.masseges";
import {usersRepository} from "../repositories/user.repository";
import {createCityDto, deleteCityDto, getCityDto} from "../types/dto/city.dto";
import {City} from "@prisma/client";


const createCity = async (data: createCityDto): Promise<void> => {
    const userDB = await usersRepository.getUserById(data.userId);

    if (!userDB) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (!userDB.isVerified) {
        throw new ApiError(403, error.EMAIL_NOT_VERIFIED)
    }

    if (userDB.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    const cityDb = await cityRepository.getCityByName(data.name);

    if (cityDb) {
        throw new ApiError(409, `City '${data.name}' already exists`)
    }

    await cityRepository.createCity(data.name);
}

const getCity = async (data: getCityDto): Promise<City | null> => {
    const userDB = await usersRepository.getUserById(data.userId);

    if (!userDB) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (!userDB.isVerified) {
        throw new ApiError(403, error.EMAIL_NOT_VERIFIED)
    }

    if (userDB.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    const cityDb = cityRepository.getCityById(data.cityId)

    if (!cityDb) {
        throw new ApiError(404, error.NOT_CITY_EXISTS);
    }

    return cityDb;
}

const getListCities = async (userId: string): Promise<City[]> => {
    const userDB = await usersRepository.getUserById(userId);

    if (!userDB) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (!userDB.isVerified) {
        throw new ApiError(403, error.EMAIL_NOT_VERIFIED)
    }

    if (userDB.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    return await cityRepository.getListCity()
}

const deleteCity = async (data: deleteCityDto): Promise<void> => {
    const userDb = await usersRepository.getUserById(data.userId);

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND);
    }

    if (!userDb.isVerified) {
        throw new ApiError(403, error.EMAIL_NOT_VERIFIED);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    const cityDb = await cityRepository.getCityById(data.cityId);

    if (!cityDb) {
        throw new ApiError(404, `City '${data.cityId}' not exist`);
    }

    await cityRepository.deleteCityById(data.cityId);
}

export const cityService = {
    createCity,
    getListCities,
    getCity,
    deleteCity
} as const