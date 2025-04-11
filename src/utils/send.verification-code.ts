import {transporter} from "../config/mail.transporter";
import {env} from "../config/secrets"
import {TypeRegisterUser} from "../types/user.register";
import {createHtmlTemplate} from "./create.html-template";
import ApiError from "../errors/ApiError";


export const sendOtpEmail = async (data: Pick<TypeRegisterUser, "email"> & {
    verificationCode: string
}): Promise<void> => {
    const mailOptions = {
        from: `"Подтверждение OTP" <${env.EMAIL_HOST_USER}>`,
        to: data.email,
        subject: "Your verification code",
        html: createHtmlTemplate(data.verificationCode),
    }

    await transporter.sendMail(mailOptions).catch((): void => {
        throw new ApiError(500, `Failed to send verification code to ${data.email}`);
    });
}