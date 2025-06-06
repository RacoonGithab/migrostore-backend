import {z} from "zod";
import {registerUserSchema} from "../schemas/register-users.schema";
import {loginSchema} from "../schemas/login.schema";

export type TypeRegisterUser = z.infer<typeof registerUserSchema>
export type TypeLoginUser = z.infer<typeof loginSchema>

