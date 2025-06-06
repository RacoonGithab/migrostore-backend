import express from "express";
import {cityController} from "../controllers/city.controller";
import {accessTokenValidation} from "../middlewares/access.token.validation";
import {requireRole} from "../middlewares/role.middleware";
import {catchAsync} from "../middlewares/async.handler";
import {validateRequestBody} from "../middlewares/validate.request.body";
import {createCitySchema} from "../schemas/city.schema";

const cityRouter = express.Router();

cityRouter.post(
    "/",
    accessTokenValidation,
    requireRole('ADMIN'),
    validateRequestBody(createCitySchema),
    catchAsync(cityController.createCity)
);

cityRouter.delete(
    "/:cityId",
    accessTokenValidation,
    requireRole('ADMIN'),
    catchAsync(cityController.deleteCity)
)

export default cityRouter;