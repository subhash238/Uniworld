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
    // Some servers (e.g. Rediffmail Pro) reject the default local machine
    // name in the HELO/EHLO greeting, so identify with the sender's domain.
    name:
      process.env.SMTP_NAME ||
      (SMTP_USER.includes("@") ? SMTP_USER.split("@")[1] : undefined),
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    // Fail fast instead of hanging the request when the mail server is
    // unreachable (e.g. outbound SMTP blocked on the host).
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
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