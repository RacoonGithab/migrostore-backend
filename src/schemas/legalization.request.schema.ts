import {z} from "zod";
import {regexPatterns} from "../utils/constants/regex.patterns";
import {ContactTimeRange, LegalizationService} from "@prisma/client";

export const createLegalizationRequestSchema = z.object({
    fullName: z
        .string()
        .regex(regexPatterns.FULL_NAME, {message: 'Full Name'}),

    phoneNumber: z
        .string()
        .regex(regexPatterns.PHONE_NUMBER, "Invalid phone number format. (e.g., +380991234567)"),

    email: z
        .string()
        .regex(regexPatterns.EMAIL, {message: "Invalid email format"})
        .nonempty("Email is required")
        .optional(),

    city: z
        .string()
        .regex(regexPatterns.CITY_NAME, {message: "Invalid city name format in list."})
        .optional(),

    service: z
        .nativeEnum(LegalizationService),

    timeRange: z
        .nativeEnum(ContactTimeRange),

    comment: z
        .string()
        .regex(regexPatterns.COMMENT, {message: "Invalid comment format."})
        .optional(),
});