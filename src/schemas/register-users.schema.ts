import {z} from "zod";
import {regexPatterns} from "../utils/constants/regex.patterns";

export const registerUserSchema = z.object({
    email: z
        .string()
        .regex(regexPatterns.EMAIL, {message: "Invalid email format"})
        .nonempty("Email is required"),

    password: z
        .string()
        .regex(regexPatterns.PASSWORD, "Invalid password format")
        .nonempty("Password is required"),
})
