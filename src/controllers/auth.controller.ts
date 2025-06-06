import { Request, Response } from "express";
import {authService} from "../services/auth.service";

const login = async (req: Request, res: Response) => {
    const { accessToken, refreshToken } = await authService.loginUser(req.body)
    res.status(200).json({accessToken, refreshToken, message:"Login successful"});
}

const verifyLoginCode = async (req: Request, res: Response) => {
    await authService.verifyLoginCode(req.body)
    res.status(200).json({message:"Sign in"})
}

const logout = async (req: Request, res: Response) => {
    await authService.logoutUser(req.params.userId)
    res.status(200).json({message:"You are logged out"});
}

const refreshToken = async (req: Request, res: Response)=> {
    const newTokenPair = await authService.refreshAccessToken(req.params.userId);
    res.status(200).json({ ...newTokenPair, message: "Refresh token successful" });
}

export const authController = {
    login,
    logout,
    refreshToken,
    verifyLoginCode
} as const;

