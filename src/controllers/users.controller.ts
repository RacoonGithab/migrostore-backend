import {Request, Response} from "express"
import {usersService} from "../services/users.service";


const registerUsers = async (req: Request, res: Response) => {
    await usersService.registerUser(req.body);
    res.status(201).json({ message: "User registration successful" });
}

const verifyUser = async (req: Request, res: Response) => {
    await usersService.verifyUser(req.body);
    res.status(201).json({ message: "User verified" });
}

const resendVerificationCode = async (req: Request, res: Response) => {
    await usersService.resendVerificationCode(req.body);
    res.status(200).json({ message: "Verification code sent successfully" });
};

const deleteUsers = async (req: Request, res: Response) => {
    await usersService.deleteUser(req.params.userId);
    res.status(204).json({ message: "User already deleted" });
}

export const usersController = {
    registerUsers,
    verifyUser,
    resendVerificationCode,
    deleteUsers
} as const;