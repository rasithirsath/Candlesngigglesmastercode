const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async ({ to, subject, html }) => {
  try {
    console.log("📧 Sending email to:", to);

    const msg = {
      to,
      from: "rasithworkspace@gmail.com",
      subject,
      html,
    };

    const response = await sgMail.send(msg);

    console.log("✅ Email sent");
  } catch (error) {
    console.error("❌ Email failed:", error.response?.body || error);
  }
};

module.exports = sendMail;
