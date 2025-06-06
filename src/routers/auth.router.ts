import express  from "express";
import {authController} from "../controllers/auth.controller";
import {validateRequestBody} from "../middlewares/validate.request.body";
import {loginSchema} from "../schemas/login.schema";
import {catchAsync} from "../middlewares/async.handler";
import {accessTokenValidation,} from "../middlewares/access.token.validation";
import {verifyUserSchema} from "../schemas/verify-user.schema";
import {refreshTokenValidation} from "../middlewares/refresh.token.validation";

const authRouters = express.Router();

authRouters.post("/login", validateRequestBody(loginSchema), catchAsync(authController.login));

authRouters.post("/verify-login-code", validateRequestBody(verifyUserSchema), catchAsync(authController.verifyLoginCode))

authRouters.post("/logout", accessTokenValidation, authController.logout);

authRouters.post("/refresh", refreshTokenValidation, authController.refreshToken);

export default authRouters;