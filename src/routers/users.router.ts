import express from "express";
import {registerUsersController} from "../controllers/users.controller"

const router = express.Router();

router.post("/", registerUsersController);

export default router;