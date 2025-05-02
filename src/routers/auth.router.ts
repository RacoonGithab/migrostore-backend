import express  from "express";
import {authController} from "../controllers/auth.controller";
import {validateRequestBody} from "../middlewares/users.validation";
import {loginSchema} from "../schemas/auth.schema";
import {catchAsync} from "../middlewares/async.handler";

const authRouters = express.Router();

authRouters.post("/login", validateRequestBody(loginSchema), catchAsync(authController.loginController));
authRouters.post("/logout", authController.logoutController);

export default authRouters;