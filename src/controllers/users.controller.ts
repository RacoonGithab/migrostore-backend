import {Request, Response} from "express"
import {usersService} from "../services/users.service";


const registerUsersController = async (req: Request, res: Response) => {
    await usersService.registerUserService(req.body);
    res.status(201).json({ message: "User registration successful" });
}

const verifyUserController = async (req: Request, res: Response) => {
    await usersService.verifyUserService(req.body);
    res.status(201).json({ message: "User verified" });
}

const resendVerificationCodeController = async (req: Request, res: Response) => {
    await usersService.resendVerificationCodeService(req.body);
    res.status(200).json({ message: "Verification code sent successfully" });
};

const deleteUsersController = async (req: Request, res: Response) => {
    await usersService.deleteUserService(req.params.userId);
    res.status(204).json({ message: "User already deleted" });
}

export const usersController = {
    registerUsersController,
    verifyUserController,
    resendVerificationCodeController,
    deleteUsersController
} as const;