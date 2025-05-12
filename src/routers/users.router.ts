import express from "express";
import {usersController} from "../controllers/users.controller"
import {validateRequestBody} from "../middlewares/validate.request.body";
import {registerUserSchema} from "../schemas/register-users.schema";
import {catchAsync} from "../middlewares/async.handler";
import {verifyUserSchema} from "../schemas/verify-user.schema";
import {resendVerificationCodeSchema} from "../schemas/resend.verification-code.schema";
import {accessTokenValidation} from "../middlewares/access.token.validation";

const userRouters = express.Router();

userRouters.post("/", validateRequestBody(registerUserSchema), catchAsync(usersController.registerUsers));

userRouters.post("/verified", validateRequestBody(verifyUserSchema), catchAsync(usersController.verifyUser));

userRouters.post("/verify/resend", validateRequestBody(resendVerificationCodeSchema), catchAsync(usersController.resendVerificationCode));

userRouters.delete("/", accessTokenValidation, catchAsync(usersController.deleteUsers));

export default userRouters;