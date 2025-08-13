'use strict';

module.exports = {
    async up(queryInterface) {
        const now = new Date();

        await queryInterface.bulkInsert('email_templates', [
            {
                name: 'activation_email',
                subject: 'Confirm your email for Finetica',
                body: `
<span style="display:none!important;visibility:hidden;mso-hide:all;font-size:1px;color:#fff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
Confirm your email to finish setting up your Finetica account.
</span>

<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f6f7fb;margin:0;padding:24px 0;">
  <tr>
    <td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e9ecf4;">
        <tr>
          <td align="center" style="padding:24px 24px 12px;background:#0f172a;">
            <img src="{{logoUrl}}" alt="Finetica logo" width="120" style="display:block;border:0;outline:none;text-decoration:none;">
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px 8px;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
            <h1 style="margin:0 0 12px;font-size:22px;line-height:1.35;color:#0f172a;">Welcome, {{userName}} 👋</h1>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#334155;">
              Thanks for signing up for <strong>Finetica</strong>. To keep your account secure, please confirm your email address.
            </p>
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
              <tr>
                <td align="center" bgcolor="#2563eb" style="border-radius:999px;">
                  <a href="{{activationLink}}" target="_blank"
                     style="display:inline-block;padding:14px 22px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.2;color:#ffffff;text-decoration:none;border-radius:999px;">
                    Confirm email
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin:0 0 12px;font-size:13px;line-height:1.7;color:#64748b;">
              The confirmation link expires in <strong>{{expiryMinutes}}</strong> minutes. If the button doesn’t work, copy and paste this URL into your browser:
            </p>
            <p style="word-break:break-all;margin:0 0 20px;font-size:12px;line-height:1.6;color:#475569;">
              {{activationLink}}
            </p>
            <p style="margin:0 0 8px;font-size:13px;line-height:1.7;color:#64748b;">
              Didn’t create an account? You can safely ignore this email.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#64748b;border-top:1px solid #e9ecf4;">
            <p style="margin:0 0 6px;">
              Need help? Contact us at <a href="mailto:FutureExperts@symphony.is" style="color:#2563eb;text-decoration:none;">FutureExperts@symphony.is</a>
            </p>
            <p style="margin:0;">Greenpark</p>
          </td>
        </tr>
      </table>
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#94a3b8;margin-top:12px;">
        © ${now.getFullYear()} Finetica. All rights reserved.
      </div>
    </td>
  </tr>
</table>
        `,
                created_at: now,
                updated_at: now,
            },

            {
                name: 'reset_password_email',
                subject: 'Reset your Finetica password',
                body: `
<span style="display:none!important;visibility:hidden;mso-hide:all;font-size:1px;color:#fff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
Use this link to reset your Finetica password. It expires in {{expiryMinutes}} minutes.
</span>

<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f6f7fb;margin:0;padding:24px 0;">
  <tr>
    <td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e9ecf4;">
        <tr>
          <td align="center" style="padding:20px;background:#0f172a;">
            <img src="{{logoUrl}}" alt="Finetica logo" width="110" style="display:block;border:0;">
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px 8px;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
            <h1 style="margin:0 0 12px;font-size:22px;line-height:1.35;color:#0f172a;">Password reset</h1>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#334155;">
              We received a request to reset your <strong>Finetica</strong> password. Click the button below to choose a new one.
            </p>
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
              <tr>
                <td align="center" bgcolor="#16a34a" style="border-radius:999px;">
                  <a href="{{resetLink}}" target="_blank"
                     style="display:inline-block;padding:14px 22px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.2;color:#ffffff;text-decoration:none;border-radius:999px;">
                    Reset password
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin:0 0 12px;font-size:13px;line-height:1.7;color:#64748b;">
              This link will expire in <strong>{{expiryMinutes}}</strong> minutes. If you didn’t request a reset, you can safely ignore this email.
            </p>
            <p style="margin:0 0 8px;font-size:13px;line-height:1.7;color:#64748b;">Or use this link:</p>
            <p style="word-break:break-all;margin:0 0 20px;font-size:12px;line-height:1.6;color:#475569;">
              {{resetLink}}
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#64748b;border-top:1px solid #e9ecf4;">
            <p style="margin:0 0 6px;">
              Need help? Contact us at <a href="mailto:FutureExperts@symphony.is" style="color:#2563eb;text-decoration:none;">FutureExperts@symphony.is</a>
            </p>
            <p style="margin:0;">Greenpark</p>
          </td>
        </tr>
      </table>
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#94a3b8;margin-top:12px;">
        © ${now.getFullYear()} Finetica. All rights reserved.
      </div>
    </td>
  </tr>
</table>
        `,
                created_at: now,
                updated_at: now,
            },

            {
                name: 'welcome_email',
                subject: 'Welcome to Finetica 🎉',
                body: `
<span style="display:none!important;visibility:hidden;mso-hide:all;font-size:1px;color:#fff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
Welcome to Finetica. Here’s what to expect next.
</span>

<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f6f7fb;margin:0;padding:24px 0;">
  <tr>
    <td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e9ecf4;">
        <tr>
          <td align="center" style="padding:20px;background:#0f172a;">
            <img src="{{logoUrl}}" alt="Finetica logo" width="110" style="display:block;border:0;">
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px 8px;font-family:Arial,Helvetica,sans-serif;color:#0f172a;">
            <h1 style="margin:0 0 12px;font-size:22px;line-height:1.35;color:#0f172a;">Welcome aboard, {{userName}}!</h1>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#334155;">
              We’re excited to have you at <strong>Finetica</strong>. Our team is reviewing your account and you’ll be notified once it’s approved.
            </p>
            <ul style="padding-left:18px;margin:0 0 18px;color:#334155;font-size:14px;line-height:1.7;">
              <li>Keep this email for your records.</li>
              <li>Need help? We’re here for you.</li>
            </ul>
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:18px 0 26px;">
              <tr>
                <td align="center" bgcolor="#2563eb" style="border-radius:999px;">
                  <a href="{{dashboardLink}}" target="_blank"
                     style="display:inline-block;padding:12px 20px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.2;color:#ffffff;text-decoration:none;border-radius:999px;">
                    Open dashboard
                  </a>
                </td>
              </tr>
            </table>
            <p style="margin:0 0 8px;font-size:13px;line-height:1.7;color:#64748b;">
            If you didn’t sign up, please let us know at <a href="mailto:FutureExperts@symphony.is" style="color:#2563eb;text-decoration:none;">FutureExperts@symphony.is</a>.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#64748b;border-top:1px solid #e9ecf4;">
            <p style="margin:0 0 6px;">
              Need help? Contact us at <a href="mailto:FutureExperts@symphony.is" style="color:#2563eb;text-decoration:none;">FutureExperts@symphony.is</a>
            </p>
            <p style="margin:0;">Greenpark</p>
          </td>
        </tr>
      </table>
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#94a3b8;margin-top:12px;">
        © ${now.getFullYear()} Finetica. All rights reserved.
      </div>
    </td>
  </tr>
</table>
        `,
                created_at: now,
                updated_at: now,
            },
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('email_templates', null, {});
    },
};
