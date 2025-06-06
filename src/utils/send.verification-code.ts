import {transporter} from "../config/mail.transporter";
import {env} from "../config/secrets"
import {createHtmlTemplate} from "./templates/create.html-template";
import ApiError from "../errors/api.error";


export const sendVerificationEmail = async (
    toEmail: string,
    verificationCode: string,
    mailSubject: string,
    fromName: string
): Promise<void> => {
    const mailOptions = {
        from: `"${fromName}" <${env.EMAIL_HOST_USER}>`,
        to: toEmail,
        subject: mailSubject,
        html: createHtmlTemplate(verificationCode),
    };

    await transporter.sendMail(mailOptions).catch((): void => {
        throw new ApiError(500, `Failed to send verification email to ${toEmail}`);
    });
};
