import express from "express";
import {accessTokenValidation} from "../middlewares/access.token.validation";
import {catchAsync} from "../middlewares/async.handler";
import {userProfileController} from "../controllers/user-profile.controller";
import {validateRequestBody} from "../middlewares/validate.request.body";
import {createUserProfileSchema, updateUserProfileSchema} from "../schemas/create.user-profile.schema";

const userProfileRouter = express.Router();

userProfileRouter.post(
    "/",
    accessTokenValidation,
    validateRequestBody(createUserProfileSchema),
    catchAsync(userProfileController.createUserProfile)
);

userProfileRouter.get(
    "/",
    accessTokenValidation,
    catchAsync(userProfileController.getUserProfile)
);

userProfileRouter.patch(
    "/",
    accessTokenValidation,
    validateRequestBody(updateUserProfileSchema),
    catchAsync(userProfileController.updateUserProfile)
)

export default userProfileRouter;