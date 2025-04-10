import express from "express";
import {usersController} from "../controllers/users.controller"

const router = express.Router();

router.post("/", usersController.registerUsers);
router.post("/verified", usersController.verifiedUsers);
router.post("/verify/resend", usersController.requestVerificationCode);
router.delete("/", usersController.deleteUsers);

export default router;