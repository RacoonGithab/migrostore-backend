import express from "express";
import {usersController} from "../controllers/users.controller"
import {validateRequestBody} from "../middlewares/users.validation";
import {registerUserSchema} from "../schemas/users.schema";
import {catchAsync} from "../middlewares/async.handler";
import {verifyUserSchema} from "../schemas/verify-user.schema";
import {resendVerificationCodeSchema} from "../schemas/resend.verification-code.schema";
import {accessTokenValidationMiddleware} from "../middlewares/auth.validation.middleware";

const userRouters = express.Router();

userRouters.post("/", validateRequestBody(registerUserSchema), catchAsync(usersController.registerUsersController));
userRouters.post("/verified", validateRequestBody(verifyUserSchema), catchAsync(usersController.verifyUserController));
userRouters.post("/verify/resend", validateRequestBody(resendVerificationCodeSchema), catchAsync(usersController.resendVerificationCodeController));
userRouters.delete("/", accessTokenValidationMiddleware, catchAsync(usersController.deleteUsersController));

export default userRouters;