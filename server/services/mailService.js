require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

async function sendEmail({ to, subject, text, html }) {
    try {
        const info = await transporter.sendMail({
            from: `"Amina Srna" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log("Message sent:", info.messageId);
    } catch (error) {
        console.error("Error sending email :", error);
    }
}

module.exports = sendEmail;
