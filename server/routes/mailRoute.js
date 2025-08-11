const express = require('express');
const sendEmail = require('../services/mailService');
const { EmailTemplate } = require('../models');
const router = express.Router();

router.get('/send-test-email', async (req, res) => {
    try {
        await sendEmail({
            to: req.query.to || 'filip.ljoljic@symphony.is',
            subject: 'Test Email from Node',
            text: 'This is my text message: Hello world!',
            html: '<b>Hello world!</b>',
        });
        res.send('Email sent successfully');
    } catch (error) {
        res.status(500).send('Error sending email');
    }
});

// List all available email templates
router.get('/email-templates', async (_req, res) => {
    try {
        const templates = await EmailTemplate.findAll({ attributes: ['name', 'subject'] });
        res.json(templates);
    } catch (error) {
        res.status(500).send('Error fetching templates: ' + error.message);
    }
});

// Send a templated email via GET (pass variables as JSON in `vars` query param)
// Example: /send-templated-email?template=activation_email&to=a@b.com&vars={"activationLink":"https://..."}
router.get('/send-templated-email', async (req, res) => {
    try {
        const templateName = req.query.template;
        const to = req.query.to;
        const rawVars = req.query.vars;

        if (!templateName || !to) {
            return res.status(400).json({ message: 'Missing required params: template, to' });
        }

        let variables = {};
        if (rawVars) {
            try {
                variables = JSON.parse(rawVars);
            } catch (_e) {
                return res.status(400).json({ message: 'Invalid vars JSON' });
            }
        }

        const info = await sendEmail.sendTemplatedEmail(templateName, to, variables);
        res.json({ message: 'Templated email sent', messageId: info.messageId });
    } catch (error) {
        res.status(500).send('Error sending templated email: ' + error.message);
    }
});

// Send a templated email via POST with JSON body: { template, to, variables }
router.post('/send-templated-email', async (req, res) => {
    try {
        const { template: templateName, to, variables = {} } = req.body || {};
        if (!templateName || !to) {
            return res.status(400).json({ message: 'Missing required fields: template, to' });
        }
        const info = await sendEmail.sendTemplatedEmail(templateName, to, variables);
        res.json({ message: 'Templated email sent', messageId: info.messageId });
    } catch (error) {
        res.status(500).send('Error sending templated email: ' + error.message);
    }
});

module.exports = router;
