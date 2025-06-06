import express from "express";
import {validateRequestBody} from "../middlewares/validate.request.body";
import {resendVerificationCodeSchema} from "../schemas/resend.verification-code.schema";
import {catchAsync} from "../middlewares/async.handler";
import {verifyUserSchema} from "../schemas/verify-user.schema";
import {resetPasswordTokenValidation} from "../middlewares/reset.token.validation";
import {resetPasswordSchema} from "../schemas/reset-pasword.schema";
import {resetPasswordController} from "../controllers/reset-password.controller";

const resetPasswordRouters = express.Router();

resetPasswordRouters.post("/request", validateRequestBody(resendVerificationCodeSchema), catchAsync(resetPasswordController.requestResetPassword))

resetPasswordRouters.post("/verify-otp", validateRequestBody(verifyUserSchema), catchAsync(resetPasswordController.verifyResetPasswordCode))

resetPasswordRouters.post("/", resetPasswordTokenValidation, validateRequestBody(resetPasswordSchema), catchAsync(resetPasswordController.resetPassword))

export default resetPasswordRouters;