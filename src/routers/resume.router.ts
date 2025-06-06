import express from "express";
import {resumeController} from "../controllers/resume.controller";
import {accessTokenValidation} from "../middlewares/access.token.validation";
import {catchAsync} from "../middlewares/async.handler";
import {uploadMiddleware} from "../middlewares/upload.middleware";
import {validateRequestBody} from "../middlewares/validate.request.body";
import {createResumeSchema, updateResumeSchema} from "../schemas/resume.schema";

const resumeRouter = express.Router();

resumeRouter.post("/", accessTokenValidation, uploadMiddleware, validateRequestBody(createResumeSchema), catchAsync(resumeController.createResume));

resumeRouter.get("/:resumeId", accessTokenValidation, catchAsync(resumeController.getUserResume));

resumeRouter.get("/", accessTokenValidation, catchAsync(resumeController.getListUserResume))

resumeRouter.patch("/:resumeId", accessTokenValidation, uploadMiddleware, validateRequestBody(updateResumeSchema), catchAsync(resumeController.updateResume));

resumeRouter.delete("/:resumeId", accessTokenValidation, catchAsync(resumeController.deleteResume));

export default resumeRouter;