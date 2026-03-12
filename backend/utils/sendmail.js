const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false,
  auth: {
    user: "apikey", // this must literally be the word "apikey"
    pass: process.env.SENDGRID_API_KEY,
  },
});

const sendMail = async ({ to, subject, html }) => {
  try {
    console.log("📧 Sending email to:", to);

    const info = await transporter.sendMail({
      from: "rasithworkspace@gmail.com", // sender email
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
