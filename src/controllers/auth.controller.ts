import { Request, Response } from "express";
import {authService} from "../services/auth.service";
import {resetPasswordService} from "../services/reset-password.service";

const login = async (req: Request, res: Response) => {
    const { accessToken, refreshToken } = await authService.loginUser(req.body)
    res.status(200).json({accessToken, refreshToken, message:"Login successful"});
}

const verifyLoginCode = async (req: Request, res: Response) => {
    await authService.verifyLoginCodeLogin(req.body)
    res.status(200).json({message:"Sign in"})
}

const requestResetPassword = async (req: Request, res: Response) => {
    await resetPasswordService.initiatePasswordReset(req.body.email)
    res.status(200).json({message:"Verification code for sending to email"})
}

const verifyResetPasswordCode = async (req: Request, res: Response) => {
    const resetPasswordToken = await resetPasswordService.verifyPasswordResetCode(req.body)
    res.status(200).json({resetPasswordToken, message:"Successful code verification"})
}

const resetPassword = async (req: Request, res: Response) => {
    const { userId, resetToken } = req.params;
    const { newPassword } = req.body;
    await resetPasswordService.passwordReset(userId, newPassword, resetToken)
    res.status(200).json({message:"Password changed"})
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
    verifyLoginCode,
    requestResetPassword,
    verifyResetPasswordCode,
    resetPassword
} as const;

