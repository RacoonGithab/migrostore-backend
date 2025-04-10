import {z} from "zod";
import {registerUserSchema} from "../schemas/users.schema";

export type TypeRegisterUser = z.infer<typeof registerUserSchema>