import express from "express";
import {usersController} from "../controllers/users.controller"
import {validateRequestBody} from "../middlewares/users.validation";
import {registerUserSchema} from "../schemas/users.schema";
import {catchAsync} from "../middlewares/async.handler";
import {verifyUserSchema} from "../schemas/verify-user.schema";
import {resendVerificationCodeSchema} from "../schemas/resend.verification-code.schema";

const userRouters = express.Router();

userRouters.post("/", validateRequestBody(registerUserSchema), catchAsync(usersController.registerUsers));
userRouters.post("/verified", validateRequestBody(verifyUserSchema), catchAsync(usersController.verifyUser));
userRouters.post("/verify/resend", validateRequestBody(resendVerificationCodeSchema), catchAsync(usersController.resendVerificationCode));
userRouters.delete("/", catchAsync(usersController.deleteUsers));

export default userRouters;