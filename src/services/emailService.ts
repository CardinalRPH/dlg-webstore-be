import nodemailer from "nodemailer";
import processEnv from "../../env";

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: processEnv.EMAIL_SERVICE_USER,
                pass: processEnv.EMAIL_SERVICE_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: `"My App" <${processEnv.EMAIL_SERVICE_USER}>`,
            to,
            subject,
            html,
        });

        return info;
    } catch (error) {
        console.error("Email send error:", error);
        throw new Error("Failed to send email");
    }
};
