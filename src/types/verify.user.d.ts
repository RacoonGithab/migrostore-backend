import {z} from "zod";
import {verifyUserSchema} from "../schemas/verify-user.schema";

export type TypeVerifyUser = z.infer<typeof verifyUserSchema>