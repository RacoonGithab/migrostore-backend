import express from "express";
import {skillController} from "../controllers/skill.controller";
import {accessTokenValidation} from "../middlewares/access.token.validation";
import {requireRole} from "../middlewares/role.middleware";
import {validateRequestBody} from "../middlewares/validate.request.body";
import {catchAsync} from "../middlewares/async.handler";
import {createSkillSchema} from "../schemas/skill.schema";

const skillRouter = express.Router();

skillRouter.post(
    "/",
    accessTokenValidation,
    requireRole('ADMIN'),
    validateRequestBody(createSkillSchema),
    catchAsync(skillController.createSkill)
);

skillRouter.delete(
    "/",
    accessTokenValidation,
    requireRole('ADMIN'),
    catchAsync(skillController.deleteSkill)
);

export default skillRouter