import express from "express";
import {usersController} from "../controllers/users.controller"
import {validateRequestBody} from "../middlewares/users.validation";
import {registerUserSchema} from "../schemas/users.schema";
import {catchAsync} from "../middlewares/async.handler";

const router = express.Router();

router.post("/", validateRequestBody(registerUserSchema), catchAsync(usersController.registerUsers));
router.post("/verified", catchAsync(usersController.verifyUser));
router.post("/verify/resend", catchAsync(usersController.requestVerificationCode));
router.delete("/", catchAsync(usersController.deleteUsers));

export default router;