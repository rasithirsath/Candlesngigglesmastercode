const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,              // use 587 (not 465)
  secure: false,          // STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,  // Gmail App Password
  },
  tls: {
    rejectUnauthorized: false,
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

const sendMail = async ({ to, subject, html }) => {
  try {
    console.log("📧 Sending email to:", to);

    const info = await transporter.sendMail({
      from: `"Candles & Giggles" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Email failed:", error);
  }
};

module.exports = sendMail;