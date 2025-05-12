import express  from "express";
import {authController} from "../controllers/auth.controller";
import {validateRequestBody} from "../middlewares/validate.request.body";
import {loginSchema} from "../schemas/login.schema";
import {catchAsync} from "../middlewares/async.handler";
import {accessTokenValidation,} from "../middlewares/access.token.validation";
import {verifyUserSchema} from "../schemas/verify-user.schema";
import {resendVerificationCodeSchema} from "../schemas/resend.verification-code.schema";
import {resetPasswordSchema} from "../schemas/reset-pasword.schema";
import {refreshTokenValidation} from "../middlewares/refresh.token.validation";
import {resetPasswordTokenValidation} from "../middlewares/reset.token.validation";

const authRouters = express.Router();

authRouters.post("/login", validateRequestBody(loginSchema), catchAsync(authController.login));

authRouters.post("/verify-login-code", validateRequestBody(verifyUserSchema), catchAsync(authController.verifyLoginCode))

authRouters.post("/password-reset/request", validateRequestBody(resendVerificationCodeSchema), catchAsync(authController.requestResetPassword))

authRouters.post("/password-reset/verify-otp", validateRequestBody(verifyUserSchema), catchAsync(authController.verifyResetPasswordCode))

authRouters.post("/password-reset", resetPasswordTokenValidation, validateRequestBody(resetPasswordSchema), catchAsync(authController.resetPassword))

authRouters.post("/logout", accessTokenValidation, authController.logout);

authRouters.post("/refresh", refreshTokenValidation, authController.refreshToken);

export default authRouters;