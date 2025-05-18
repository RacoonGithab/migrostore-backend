import {cityRepository} from "../repositories/city.repository";
import ApiError from "../errors/api.error";
import {error} from "../utils/constants/error.masseges";


const createCity = async (name: string): Promise<void> => {
    const cityDb = await cityRepository.getCityByName(name);

    if (cityDb) {
        throw new ApiError(409, `City '${name}' already exists`)
    }

    await cityRepository.createCity(name);
}

export const validateCity = async (city: string | undefined): Promise<void> => {
    if (city) {
        const cityExist = await cityRepository.getCityByName(city);
        if (!cityExist) {
            throw new ApiError(404, error.NOT_CITY_EXISTS);
        }
    }
};


export const cityService = {
    createCity,
    validateCity
} as const