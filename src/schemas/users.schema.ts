import { z } from "zod";

export const RegisterUserSchema = z.object({
    email: z.string()
        .email("incorrect email format")
        .min(5, "Email must contain at least 5 characters")
        .max(255, "Email must contain no more than 255 characters."),
    password: z.string()
        .min(6, "Password must contain at least 8 characters")
        .max(100, "Password must contain no more than 100 characters"),
});
