import express from "express";
import {resumeController} from "../controllers/resume.controller";

const resumeRouter = express.Router();

resumeRouter.post("/", resumeController.createResume);

export default resumeRouter;