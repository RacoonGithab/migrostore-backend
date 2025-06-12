import express from "express";
import {accessTokenValidation} from "../middlewares/access.token.validation";
import {countryController} from "../controllers/country.controller";
import {catchAsync} from "../middlewares/async.handler";
import {requireRole} from "../middlewares/role.middleware";
import {validateRequestBody} from "../middlewares/validate.request.body";
import {createCountrySchema} from "../schemas/create-country.schema";

const countryRouter = express.Router();

countryRouter.post(
    "/",
    accessTokenValidation,
    requireRole('ADMIN'),
    validateRequestBody(createCountrySchema),
    catchAsync(countryController.createCountry)
);

countryRouter.get(
    "/:countryId",
    accessTokenValidation,
    catchAsync(countryController.getCountry)
);

countryRouter.get(
    "/",
    accessTokenValidation,
    catchAsync(countryController.getListCountries)
);

countryRouter.delete(
    "/:countryId",
    accessTokenValidation,
    requireRole('ADMIN'),
    catchAsync(countryController.deleteCountry)
);

export default countryRouter;