const nodemailer = require("nodemailer");

const sendContactNotification = async (inquiry) => {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn("Contact email not sent: SMTP_HOST, SMTP_USER, and SMTP_PASS must be configured.");
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM || SMTP_USER,
    to: process.env.CONTACT_NOTIFICATION_EMAIL || "info@uniworldvision.com",
    replyTo: inquiry.email,
    subject: "New contact form inquiry",
    text: [
      `Name: ${inquiry.name}`,
      `Email: ${inquiry.email}`,
      `Phone: ${inquiry.phone || "Not provided"}`,
      `Subject: ${inquiry.subject || "Not provided"}`,
      "",
      "Message:",
      inquiry.message,
    ].join("\n"),
  });

  return true;
};

module.exports = { sendContactNotification };