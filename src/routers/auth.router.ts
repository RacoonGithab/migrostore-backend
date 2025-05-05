import express  from "express";
import {authController} from "../controllers/auth.controller";
import {validateRequestBody} from "../middlewares/users.validation";
import {loginSchema} from "../schemas/auth.schema";
import {catchAsync} from "../middlewares/async.handler";
import {authValidationMiddleware} from "../middlewares/auth.validation.middleware";

const authRouters = express.Router();

authRouters.post("/login", validateRequestBody(loginSchema), catchAsync(authController.loginController));
authRouters.post("/logout", authValidationMiddleware, authController.logoutController);

export default authRouters;