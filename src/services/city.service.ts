import {cityRepository} from "../repositories/city.repository";
import ApiError from "../errors/api.error";


const createCity = async (name: string): Promise<void> => {
    const cityDb = await cityRepository.getCityByName(name);

    if (cityDb) {
        throw new ApiError(409, `City '${name}' already exists`)
    }

    await cityRepository.createCity(name);
}

export const cityService = {
    createCity,
} as const