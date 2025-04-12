import {z} from "zod";
import {verifyUserSchema} from "../schemas/verify-user.schema";
import {resendVerificationCodeSchema} from "../schemas/resend.verification-code.schema";

export type TypeVerifyUser = z.infer<typeof verifyUserSchema>

export type TypeResendVerificationCode = z.infer<typeof resendVerificationCodeSchema>