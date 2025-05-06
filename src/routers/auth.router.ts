import express  from "express";
import {authController} from "../controllers/auth.controller";
import {validateRequestBody} from "../middlewares/users.validation";
import {loginSchema} from "../schemas/auth.schema";
import {catchAsync} from "../middlewares/async.handler";
import {
    accessTokenValidationMiddleware,
    refreshTokenValidationMiddleware
} from "../middlewares/auth.validation.middleware";

const authRouters = express.Router();

authRouters.post("/login", validateRequestBody(loginSchema), catchAsync(authController.loginController));
authRouters.post("/logout", accessTokenValidationMiddleware, authController.logoutController);
authRouters.post("/refresh", refreshTokenValidationMiddleware, authController.refreshTokenController);

export default authRouters;