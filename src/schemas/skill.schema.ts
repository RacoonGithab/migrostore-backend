import { z } from 'zod';
import {regexPatterns} from "../utils/constants/regex.patterns";

export const createSkillSchema = z.object({
    name: z.string()
        .regex(regexPatterns.SKILL_NAME, { message: "The skill name can only contain letters, numbers, spaces, and periods (minimum 2 characters)." })
        .nonempty("Skill name is required."),
});