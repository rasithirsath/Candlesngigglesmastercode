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
  socketTimeout: 10000,
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
