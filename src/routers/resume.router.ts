import express from "express";
import {resumeController} from "../controllers/resume.controller";
import {accessTokenValidation} from "../middlewares/access.token.validation";
import {catchAsync} from "../middlewares/async.handler";
import {uploadMiddleware} from "../middlewares/upload.middleware";
import {validateRequestBody} from "../middlewares/validate.request.body";
import {createResumeSchema} from "../schemas/resume.schema";

const resumeRouter = express.Router();

resumeRouter.post("/", accessTokenValidation, uploadMiddleware, validateRequestBody(createResumeSchema), catchAsync(resumeController.createResume));

resumeRouter.get("/pdf/:resumeId", accessTokenValidation, catchAsync(resumeController.getResumeById))

export default resumeRouter;