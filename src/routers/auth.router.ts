import express  from "express";
import {authController} from "../controllers/auth.controller";

const authRouters = express.Router();

authRouters.post("/login", authController.loginController);
authRouters.post("/logout", authController.logoutController);

export default authRouters;