import { z } from 'zod';
import {regexPatterns} from "../utils/constants/regex.patterns";

export const createCitySchema = z.object({
    name: z.string()
        .regex(regexPatterns.CITY_NAME, { message: "The city name can only contain letters, numbers, spaces, and hyphens (minimum 2 characters)." })
        .nonempty("City name is required."),
});