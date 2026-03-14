const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async ({ to, subject, html }) => {
  try {
    console.log("📧 Sending email to:", to);

    const msg = {
      to,
      from: {
        email: process.env.MAIL_FROM,
        name: "Candles & Giggles",
      },
      replyTo: process.env.MAIL_FROM,
      subject,
      html,
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
      },
    };

    await sgMail.send(msg);

    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Email failed:", error.response?.body || error);
  }
};

module.exports = sendMail;
