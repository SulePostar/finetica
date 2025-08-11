'use strict';

module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert('email_templates', [
            {
                name: 'activation_email',
                subject: 'Activate Your Account',
                body: '<h2>Welcome!</h2><p>Please <a href="{{activationLink}}">click here to activate your account</a>.</p><p>This link will expire in 10 minutes.</p>',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'reset_password_email',
                subject: 'Reset Your Password',
                body: '<h2>Password Reset Request</h2><p>If you requested a password reset, please <a href="{{resetLink}}">click here to reset your password</a>.</p><p>This link is valid for 15 minutes.</p>',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                name: 'welcome_email',
                subject: 'Welcome to Finetica!',
                body: '<h2>Welcome to Finetica!</h2><p>Hello {{userName}},</p><p>We\'re excited to have you on board!</p>',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('email_templates', null, {});
    },
};


