import express  from "express";
import {accessTokenValidation} from "../middlewares/access.token.validation";
import {uploadMiddleware} from "../middlewares/upload.middleware";
import {validateRequestBody} from "../middlewares/validate.request.body";
import {createLegalizationRequestSchema} from "../schemas/legalization.request.schema";
import {catchAsync} from "../middlewares/async.handler";
import {legalizationRequestController} from "../controllers/legalization.request.controller";


const legalizationRequestRouter = express.Router();

legalizationRequestRouter.post(
    "/",
    accessTokenValidation,
    uploadMiddleware,
    validateRequestBody(createLegalizationRequestSchema),
    catchAsync(legalizationRequestController.createLegalizationRequest),
)

export default legalizationRequestRouter;