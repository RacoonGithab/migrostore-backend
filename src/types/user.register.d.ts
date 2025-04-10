import {z} from "zod";
import {RegisterUserSchema} from "../schemas/users.schema";

export type TypeRegisterUser = z.infer<typeof RegisterUserSchema>