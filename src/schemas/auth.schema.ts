import {z} from "zod"
import {regexPatterns} from "../utils/constants/regex.patterns";

export const loginSchema = z.object({
    email: z.string().regex(regexPatterns.EMAIL, "Invalid email format").nonempty("Email is required"),
    password: z.string().nonempty("Password is required"),
});