import {transporter} from "../config/mail.transporter";
import {env} from "../config/secrets"
import {TypeLoginUser, TypeRegisterUser} from "../types/user.types";
import {createHtmlTemplate} from "./create.html-template";
import ApiError from "../errors/ApiError";


export const sendVerificationCodeEmail = async (data: Pick<TypeRegisterUser, "email"> & {
    verificationCode: string
}): Promise<void> => {
    const mailOptions = {
        from: `"Код подтверждение" <${env.EMAIL_HOST_USER}>`,
        to: data.email,
        subject: "Your verification code",
        html: createHtmlTemplate(data.verificationCode),
    }

    await transporter.sendMail(mailOptions).catch((): void => {
        throw new ApiError(500, `Failed to send verification code to ${data.email}`);
    });
}

export const sendLoginVerificationCodeEmail = async (data: Pick<TypeLoginUser, "email"> & {
    verificationCode: string
}): Promise<void> => {
    const mailOptions = {
        from: `"Код подтверждение повторного входа" <${env.EMAIL_HOST_USER}>`,
        to: data.email,
        subject: "Your verification code",
        html: createHtmlTemplate(data.verificationCode),
    }

    await transporter.sendMail(mailOptions).catch((): void => {
        throw new ApiError(500, `Failed to send verification code to ${data.email}`);
    })
}