import { Request, Response } from "express";
import {authService} from "../services/auth.service";

const loginController = async (req: Request, res: Response) => {
    const { accessToken, refreshToken } = await authService.loginService(req.body)
    res.status(200).json({accessToken, refreshToken, message:"Login successful"});
}

const verifyLoginCodeController = async (req: Request, res: Response) => {
    await authService.verifyLoginCodeLoginService(req.body)
    res.status(200).json({message:"Sign in"})
}

const requestResetPasswordController = async (req: Request, res: Response) => {
    await authService.initiatePasswordResetService(req.body.email)
    res.status(200).json({message:"Verification code for sending to email"})
}

const verifyResetPasswordCodeController = async (req: Request, res: Response) => {
    const resetPasswordToken = await authService.verifyPasswordResetCodeService(req.body)
    res.status(200).json({resetPasswordToken, message:"Successful code verification"})
}

const resetPasswordController = async (req: Request, res: Response) => {
    const { userId, resetToken } = req.params;
    const { newPassword } = req.body;
    await authService.passwordResetService(userId, newPassword, resetToken)
    res.status(200).json({message:"Password changed"})
}

const logoutController = async (req: Request, res: Response) => {
    await authService.logoutService(req.params.userId)
    res.status(200).json({message:"You are logged out"});
}

const refreshTokenController = async (req: Request, res: Response)=> {
    const newTokenPair = await authService.refreshAccessTokenService(req.params.userId);
    res.status(200).json({ ...newTokenPair, message: "Refresh token successful" });
}

export const authController = {
    loginController,
    logoutController,
    refreshTokenController,
    verifyLoginCodeController,
    requestResetPasswordController,
    verifyResetPasswordCodeController,
    resetPasswordController
} as const;

