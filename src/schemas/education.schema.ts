import {z} from "zod";
import {regexPatterns} from "../utils/constants/regex.patterns";


export const educationSchema = z.object({
    specialty: z
        .string()
        .regex(regexPatterns.TITLE_POSITION_SPECIALTY_NAME, { message: "The position name is required." }),

    institutionName: z
        .string()
        .regex(regexPatterns.COMPANY_INSTITUTION_NAME, { message: "The company name is required." }),

    startDate: z
        .string()
        .regex(regexPatterns.START_DATE, {message: "Start date must be in YYYY-MM-DD format."})
        .transform((str) => {
            const date = new Date(str);

            if (isNaN(date.getTime())) {
                throw new Error("Invalid start date format.");
            }
            return date.toISOString();
        }),

    endDate: z
        .string()
        .regex(regexPatterns.END_DATE, {message: "End date must be in YYYY-MM-DD format."})
        .transform((str) => {
            const date = new Date(str);

            if (isNaN(date.getTime())) {
                throw new Error("Invalid start date format.");
            }

            return date.toISOString();
        })
        .optional()
        .nullable(),

    isCurrentStudy: z
        .coerce
        .boolean(),
});