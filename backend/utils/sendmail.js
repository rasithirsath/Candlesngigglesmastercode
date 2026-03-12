const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
});

const sendMail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Candles & Giggles" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
//send mail to admin
const sendmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Candles & Giggles" <${process.env.ADMIN_EMAIL}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendMail;
