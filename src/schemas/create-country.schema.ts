import {z} from 'zod';
import {regexPatterns} from "../utils/constants/regex.patterns";

export const createCountrySchema = z.object({
    name: z.string()
        .regex(regexPatterns.COUNTRY, { message: "The country name can only contain letters, numbers, spaces, and hyphens (minimum 2 characters)." })
        .nonempty("Country name is required."),
})