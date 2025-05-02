import { Request, Response } from "express";
import {authService} from "../services/auth.service";

const loginController = async (req: Request, res: Response) => {
    await authService.loginService(req.body)
    res.status(201).json({message:"Login successful"});
}

const logoutController = async (req: Request, res: Response) => {
    res.status(201).json({message:"You are logged out"});
}


export const authController = {
    loginController,
    logoutController,
} as const;

