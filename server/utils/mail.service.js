const nodemailer = require('nodemailer');
const config = require('../config/config.js');

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: config.smtpHost,
  port: config.smtpPort,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPass,
  },
});
export const sendMail = async (to, subject, text) => {
  const mailOptions = {
    from: "noreply@tms.ba",
    to,
    subject,
    html: text, // text=plain text or html:text as html
  };
  return transporter.sendMail(mailOptions);
};









