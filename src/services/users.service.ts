import {usersRepository} from "../repositories/user.repository";
import {TypeRegisterUser} from "../types/user.register";
import {createPasswordHash} from "../utils/auth.util";
import ApiError from "../errors/ApiError";
import {USER_ALREADY_EXISTS} from "../utils/constants/error.masseges";

const registerUser = async (data: TypeRegisterUser):Promise<void> => {
    const userDb = await usersRepository.getByEmail(data.email);

    if (userDb) {
        throw new ApiError(409, USER_ALREADY_EXISTS);
    }

    const createdUser = await usersRepository.createUser({
        email: data.email,
        password: await createPasswordHash(data.password),
        updatedAt: new Date(),
        createdAt: new Date()
    });
}

export const usersService = {
    registerUser
} as const;