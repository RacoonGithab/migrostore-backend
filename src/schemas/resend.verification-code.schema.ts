import {z} from 'zod';
import {regexPatterns} from "../utils/constants/regex.patterns";

export const resendVerificationCodeSchema = z.object({

    email: z
        .string()
        .regex(regexPatterns.EMAIL, {message: "Invalid email format"})
        .nonempty("Email is required"),
})