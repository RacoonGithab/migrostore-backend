import {z} from 'zod';
import {regexPatterns} from "../utils/constants/regex.patterns";

export const verifyUserSchema = z.object({

    email: z.string().nonempty("Email is required").regex(regexPatterns.EMAIL, "Invalid email format"),

    verificationCode: z.string().nonempty("Verification code is required").regex(regexPatterns.VERIFICATION_CODE, "Invalid verification code format"),
})