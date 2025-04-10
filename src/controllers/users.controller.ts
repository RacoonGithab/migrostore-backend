import {Request, Response} from "express"
import {usersService} from "../services/users.service";


const registerUsers = async (req: Request, res: Response) => {
    await usersService.registerUser(req.body)
    res.status(201).json({ message: "User registration successful" });
}

const verifiedUsers = async (req: Request, res: Response) => {
    res.status(200).json({ message: "User already verified" });
}

const deleteUsers = async (req: Request, res: Response) => {
    res.status(200).json({ message: "User already deleted" });
}

export const usersController = {
    registerUsers,
    verifiedUsers,
    deleteUsers
} as const;