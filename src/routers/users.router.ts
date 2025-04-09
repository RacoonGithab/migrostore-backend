import express from "express";
import {registerUsersController} from "../controllers/users.controller"

const router = express.Router();

router.post("/register", registerUsersController);

export default router;