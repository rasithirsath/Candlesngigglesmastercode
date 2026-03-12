const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // 🔥 THIS FIXES YOUR ERROR
  },
});

const sendMail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Gilded Glow Candles" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
//send mail to admin
const sendmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Gilded Glow Candles" <${process.env.ADMIN_EMAIL}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendMail;
