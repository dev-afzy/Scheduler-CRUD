const nodemailer = require('nodemailer');
const { mail } = require('../config/config');

const MailService = {
  /**
   * Send mail using SMTP server
   * @param {string} to - email address of the recipient
   * @param {string} subject - subject of the email
   * @param {string} html - html of the email
   * @return {Promise<response>} resolves to the response of the email server
   * */
  sendMail: async ({ to, subject, html }) => {
    let transporter = nodemailer.createTransport({
      host: mail.host,
      port: 587,
      auth: {
        user: mail.user,
        pass: mail.password,
      },
    });
    const mailOptions = {
      from: mail.user,
      to,
      subject,
      html,
    };

    const response = await transporter.sendMail(mailOptions);
    return response;
  },
};

module.exports = MailService;
