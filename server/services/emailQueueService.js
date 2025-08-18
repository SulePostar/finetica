const { sendTemplatedEmail } = require('./mailService');
const { EmailQueue, User } = require('../models');

async function processEmailQueue() {
    const emails = await EmailQueue.findAll({ where: { status: 'pending' } });

    for (const email of emails) {
        try {
            // Pretpostavljam da template_name već postoji u tvojoj EmailTemplate tabeli
            await sendTemplatedEmail(email.templateName, email.variables.email, email.variables);

            // Update status
            console.log(`Sending email id: ${email.id}, template: ${email.templateName}, to: ${email.variables.email}`);

            email.status = 'sent';
            email.sentAt = new Date();
            await email.save();
            console.log(`✅ Sent email ${email.id} to ${email.variables.email}`);
        } catch (err) {
            console.error(`❌ Failed to send email ${email.id}, ${err} `);
            console.log(`Sending email id: ${email.id}, template: ${email.templateName}, to: ${email.variables.email}`);
            console.log(`Sending email id: ${email.id}, template: ${email.templateName}, to: ${email.variables.email}`);

            email.status = 'failed';
            await email.save();
        }
    }
}

module.exports = { processEmailQueue };