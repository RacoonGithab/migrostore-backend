import { Request, Response } from "express";
import {authService} from "../services/auth.service";

const loginController = async (req: Request, res: Response) => {
    const { accessToken, refreshToken } = await authService.loginService(req.body)
    res.status(201).json({accessToken, refreshToken, message:"Login successful"});
}

const logoutController = async (req: Request, res: Response) => {
    await authService.logoutService(req.params.id)
    res.status(200).json({message:"You are logged out"});
}

const refreshTokenController = async (req: Request, res: Response)=> {
    const { userId, jti, refreshToken } = req.params;
    const newTokenPair = await authService.refreshAccessToken(refreshToken, userId, jti);
    res.status(200).json({ ...newTokenPair, message: "Refresh token successful" });
}

export const authController = {
    loginController,
    logoutController,
    refreshTokenController
} as const;

