import {createCountryDto, deleteCountryDto, getCountryDto} from "../types/dto/country.dto";
import {usersRepository} from "../repositories/user.repository";
import ApiError from "../errors/api.error";
import {error} from "../utils/constants/error.masseges";
import {countryRepository} from "../repositories/country.repository";
import {Country} from "@prisma/client";

const createCountry = async (data: createCountryDto): Promise<void> => {
    const userDb = await usersRepository.getUserById(data.userId);

    if (!userDb) {
        throw new ApiError(401, error.USER_DOES_NOT_EXIST);
    }

    if (!userDb.isVerified) {
        throw new ApiError(403, error.EMAIL_NOT_VERIFIED);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    const countryDb = await countryRepository.getCountryByName(data.name);

    if (countryDb) {
        throw new ApiError(409, `Country '${data.name}' already exists`)
    }

    await countryRepository.createCountryByName(data.name);
}

const getCountry = async (data: getCountryDto): Promise<Country | null> => {
    const userDb = await usersRepository.getUserById(data.userId);

    if (!userDb) {
        throw new ApiError(401, error.USER_DOES_NOT_EXIST);
    }

    if (!userDb.isVerified) {
        throw new ApiError(403, error.EMAIL_NOT_VERIFIED);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    const countryDb = await countryRepository.getCountryById(data.countryId)

    if (!countryDb) {
        throw new ApiError(404, error.NOT_FOUND);
    }
    return countryDb
}

const getListCountries = async (userId: string): Promise<Country[]> => {
    const userDb = await usersRepository.getUserById(userId);

    if (!userDb) {
        throw new ApiError(401, error.USER_DOES_NOT_EXIST);
    }

    if (!userDb.isVerified) {
        throw new ApiError(403, error.EMAIL_NOT_VERIFIED);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    return await countryRepository.getListCountries()
}

const deleteCountry = async (data: deleteCountryDto): Promise<void> => {
    const userDb = await usersRepository.getUserById(data.userId);

    if (!userDb) {
        throw new ApiError(401, error.USER_DOES_NOT_EXIST);
    }

    if (!userDb.isVerified) {
        throw new ApiError(403, error.EMAIL_NOT_VERIFIED);
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED);
    }

    const countryDb = await countryRepository.getCountryById(data.countryId);

    if (!countryDb) {
        throw new ApiError(404, error.NOT_FOUND);
    }

    await countryRepository.deleteCountryById(data.countryId);
}

export const countryService = {
    getCountry,
    createCountry,
    getListCountries,
    deleteCountry,
}