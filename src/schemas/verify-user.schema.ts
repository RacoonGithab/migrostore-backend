import {z} from 'zod';
import {regexPatterns} from "../utils/constants/regex.patterns";

export const verifyUserSchema = z.object({

    email: z
        .string()
        .regex(regexPatterns.EMAIL, {message: "Invalid email format"})
        .nonempty("Email is required"),

    verificationCode: z
        .string()
        .nonempty("Verification code is required")
        .regex(regexPatterns.VERIFICATION_CODE, "Invalid verification code format"),
})