const sgMail = require('@sendgrid/mail');

if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

async function sendEmail({ to, subject, text, html }) {
    try {
        const msg = {
            to,
            from: process.env.SENDGRID_FROM_EMAIL,
            subject,
            text,
            html,
        };
        const response = await sgMail.send(msg);
        console.log('SendGrid message sent. Status code:', response[0].statusCode);
        return response;
    } catch (error) {
        console.error('Error sending email with SendGrid:', error);
        if (error.response) {
            console.error(error.response.body);
        }
        throw error;
    }
}

async function sendTemplatedEmail(to, templateId, dynamicTemplateData = {}) {
    try {
        const msg = {
            to,
            from: process.env.SENDGRID_FROM_EMAIL,
            templateId,
            dynamicTemplateData,
        };
        const response = await sgMail.send(msg);
        console.log('SendGrid templated message sent. Status code:', response[0].statusCode);
        return response;
    } catch (error) {
        console.error('Error sending templated email with SendGrid:', error);
        if (error.response) {
            console.error(error.response.body);
        }
        throw error;
    }
}

module.exports = {
    sendEmail,
    sendTemplatedEmail
};
