import { z } from 'zod';
import {regexPatterns} from "../utils/constants/regex.patterns";
import {workExperienceSchema} from "./work.experience.schema";
import {educationSchema} from "./education.schema";
import {languageSkillSchema} from "./language.skill.schema";

export const createResumeSchema = z.object({
    title: z.string()
        .regex(regexPatterns.TITLE_POSITION_SPECIALTY_NAME, { message: "The position name is required." }),
    firstName: z.string()
        .regex(regexPatterns.FIRST_NAME, "Invalid name format"),
    lastName: z.string()
        .regex(regexPatterns.LAST_NAME, "Invalid name format"),
    phoneNumber: z.string()
        .regex(regexPatterns.PHONE_NUMBER, "Invalid phone number format. (e.g., +380991234567)"),
    email: z.string()
        .regex(regexPatterns.EMAIL, {message: "Invalid email format"})
        .nonempty("Email is required"),
    dateOfBirth: z.string()
        .regex(regexPatterns.END_DATE, {message: "Date of birth must be in YYYY-MM-DD format."})
        .transform((str) => {
            const date = new Date(str);

            if (isNaN(date.getTime())) {
                throw new Error("Invalid start date format.");
            }

            return date.toISOString();
        }),
    aboutMe: z.string()
        .regex(regexPatterns.ABOUT_ME, "Invalid description format"),
    country: z.string()
        .regex(regexPatterns.COUNTRY, {message: "Invalid country"})
        .optional(),
    qualification: z.string()
        .regex(regexPatterns.TITLE_POSITION_SPECIALTY_NAME, {message: "Invalid title format"})
        .optional(),
    skills: z.array(z.string()
        .regex(regexPatterns.SKILL_NAME, "The skill name can only contain letters, numbers, spaces, and periods (minimum 2 characters).")),
    photo: z.string()
        .optional(),
    pdfFilename: z.string()
        .optional(),
    clearPhoto: z.coerce
        .boolean()
        .optional(),

    workExperiences: z.array(workExperienceSchema).optional(),
    educations: z.array(educationSchema).optional(),
    languageSkills: z.array(languageSkillSchema).optional(),
});

export const updateResumeSchema = createResumeSchema.partial()
