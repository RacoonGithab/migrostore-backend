import {z} from 'zod';
import {regexPatterns} from "../utils/constants/regex.patterns";

export const resendVerificationCodeSchema = z.object({

    email: z.string().nonempty("Email is required").regex(regexPatterns.EMAIL, "Invalid email format"),
})