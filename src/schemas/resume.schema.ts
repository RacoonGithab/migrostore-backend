import { z } from 'zod';
import {regexPatterns} from "../utils/constants/regex.patterns";

export const createResumeSchema = z.object({
    firstName: z.string().regex(regexPatterns.FIRST_NAME, "Invalid name format"),
    lastName: z.string().regex(regexPatterns.LAST_NAME, "Invalid name format"),
    age: z.coerce.number()
        .int()
        .min(16, { message: "Age must be at least 16 years old.." })
        .max(100, { message: "Age must not exceed 100 years." }),
    education: z.string().regex(regexPatterns.EDUCATION, "Invalid description format"),
    workExperience: z.string().regex(regexPatterns.WORK_EXPERIENCE, "Invalid description format"),
    aboutMe: z.string().regex(regexPatterns.ABOUT_ME, "Invalid description format"),
    city: z.string()
        .regex(regexPatterns.CITY_NAME, "The city name can only contain letters, numbers, spaces, and hyphens (minimum 2 characters).")
        .optional(),
    skills: z.array(z.string()
        .regex(regexPatterns.SKILL_NAME, "The skill name can only contain letters, numbers, spaces, and periods (minimum 2 characters).")),
    photo: z.string().optional(),
    pdfFilename: z.string().optional(),
});
