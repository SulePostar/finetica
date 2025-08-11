const express = require('express');
const { sendEmail, sendTemplatedEmail } = require('../services/mailService');
const { EmailTemplate } = require('../models');
const router = express.Router();

// Remove the basic test GET endpoint to avoid confusion; prefer using templates via POST

// List all available email templates
router.get('/email-templates', async (_req, res) => {
    try {
        const templates = await EmailTemplate.findAll({ attributes: ['name', 'subject'] });
        res.json(templates);
    } catch (error) {
        res.status(500).send('Error fetching templates: ' + error.message);
    }
});

// Remove GET sender; prefer POST for clarity and payload safety

// Send a templated email via POST with JSON body: { template, to, variables }
router.post('/send-templated-email', async (req, res) => {
    try {
        const { template: templateName, to, variables = {} } = req.body || {};
        if (!templateName || !to) {
            return res.status(400).json({ message: 'Missing required fields: template, to' });
        }
        const info = await sendTemplatedEmail(templateName, to, variables);
        res.json({ message: 'Templated email sent', messageId: info.messageId });
    } catch (error) {
        res.status(500).send('Error sending templated email: ' + error.message);
    }
});

module.exports = router;
