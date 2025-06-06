import {Request, Response} from "express";
import {resetPasswordService} from "../services/reset-password.service";


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


export const resetPasswordController = {
    requestResetPassword,
    verifyResetPasswordCode,
    resetPassword,
} as const;