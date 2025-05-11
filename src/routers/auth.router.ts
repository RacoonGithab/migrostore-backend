import express  from "express";
import {authController} from "../controllers/auth.controller";
import {validateRequestBody} from "../middlewares/users.validation";
import {loginSchema} from "../schemas/auth.schema";
import {catchAsync} from "../middlewares/async.handler";
import {
    accessTokenValidationMiddleware,
    refreshTokenValidationMiddleware,
    resetPasswordTokenValidationMiddleware
} from "../middlewares/auth.validation.middleware";
import {verifyUserSchema} from "../schemas/verify-user.schema";
import {resendVerificationCodeSchema} from "../schemas/resend.verification-code.schema";
import {resetPasswordSchema} from "../schemas/reset-pasword.schema";

const authRouters = express.Router();

authRouters.post("/login", validateRequestBody(loginSchema), catchAsync(authController.loginController));

authRouters.post("/verify-login-code", validateRequestBody(verifyUserSchema), catchAsync(authController.verifyLoginCodeController))

authRouters.post("/password-reset/request", validateRequestBody(resendVerificationCodeSchema), catchAsync(authController.requestResetPasswordController))

authRouters.post("/password-reset/verify-otp", validateRequestBody(verifyUserSchema), catchAsync(authController.verifyResetPasswordCodeController))

authRouters.post("/password-reset", resetPasswordTokenValidationMiddleware, validateRequestBody(resetPasswordSchema), catchAsync(authController.resetPasswordController))

authRouters.post("/logout", accessTokenValidationMiddleware, authController.logoutController);

authRouters.post("/refresh", refreshTokenValidationMiddleware, authController.refreshTokenController);

export default authRouters;