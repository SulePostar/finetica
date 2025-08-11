require('dotenv').config();
const nodemailer = require('nodemailer');
const { EmailTemplate } = require('../models');

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
            from: `${process.env.SMTP_USER}`,
            to,
            subject,
            text,
            html,
        });
        console.log('Message sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

function renderTemplate(templateString, variables) {
    return Object.entries(variables).reduce((content, [key, value]) => {
        const pattern = new RegExp(`{{${key}}}`, 'g');
        return content.replace(pattern, String(value));
    }, templateString);
}

async function sendTemplatedEmail(templateName, to, variables = {}) {
    const template = await EmailTemplate.findOne({ where: { name: templateName } });
    if (!template) {
        throw new Error(`Email template "${templateName}" not found.`);
    }

    const subject = renderTemplate(template.subject, variables);
    const html = renderTemplate(template.body, variables);

    return sendEmail({ to, subject, html });
}

module.exports = { sendEmail, sendTemplatedEmail };
