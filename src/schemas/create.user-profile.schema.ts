import { z } from "zod";
import {regexPatterns} from "../utils/constants/regex.patterns";
import {EntryBasis} from "../types/enums/entry-basis.enum"
import {LanguageLevel} from "../types/enums/language-level.enum"

export const createUserProfileSchema = z.object({
    firstName: z.string().regex(regexPatterns.FIRST_NAME, "Invalid name format"),
    lastName: z.string().regex(regexPatterns.LAST_NAME, "Invalid name format"),
    dateOfBirth: z.coerce.date({
        required_error: "Date of birth is required.",
        invalid_type_error: "Date of birth must be a valid date string (YYYY-MM-DD)."
    }).refine((date) => {
            const today = new Date();
            const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
            return date < today && date <= eighteenYearsAgo;
        }, {
            message: "Date of birth cannot be in the future and you must be at least 18 years old."
        }),
    email: z.string().regex(regexPatterns.EMAIL, "Invalid email format").nonempty("Email is required"),
    country: z.string()
        .regex(regexPatterns.COUNTRY, "Invalid country name format. Only letters, spaces, hyphens, and apostrophes are allowed.")
        .optional(),
    entryBasis: z.nativeEnum(EntryBasis, {invalid_type_error: "Invalid entry basis provided."}).optional(),
    citiesForJob: z.array(z.string().regex(regexPatterns.CITY_NAME, "Invalid city name format in list."))
        .optional()
        .default([]),
    polishLanguageLevel: z.nativeEnum(LanguageLevel, {invalid_type_error: "Invalid Polish language level provided."}).optional(),
    englishLanguageLevel: z.nativeEnum(LanguageLevel, {invalid_type_error: "Invalid English language level provided."}).optional(),
    skills: z.array(z.string().regex(regexPatterns.SKILL_NAME, "Invalid skill name format in list."))
        .optional()
        .default([]),
})

export const updateUserProfileSchema = createUserProfileSchema.partial();

