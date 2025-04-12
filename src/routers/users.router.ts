import express from "express";
import {usersController} from "../controllers/users.controller"
import {validateRequestBody} from "../middlewares/users.validation";
import {registerUserSchema} from "../schemas/users.schema";
import {catchAsync} from "../middlewares/async.handler";
import {verifyUserSchema} from "../schemas/verify-user.schema";
import {resendVerificationCodeSchema} from "../schemas/resend.verification-code.schema";

const router = express.Router();

router.post("/", validateRequestBody(registerUserSchema), catchAsync(usersController.registerUsers));
router.post("/verified", validateRequestBody(verifyUserSchema), catchAsync(usersController.verifyUser));
router.post("/verify/resend", validateRequestBody(resendVerificationCodeSchema), catchAsync(usersController.resendVerificationCode));
router.delete("/", catchAsync(usersController.deleteUsers));

export default router;