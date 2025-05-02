import {z} from "zod";
import {registerUserSchema} from "../schemas/users.schema";
import {loginSchema} from "../schemas/auth.schema";

export type TypeRegisterUser = z.infer<typeof registerUserSchema>
export type TypeLoginUser = z.infer<typeof loginSchema>