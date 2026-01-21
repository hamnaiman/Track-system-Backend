const nodemailer = require("nodemailer");

module.exports = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // MUST be false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // 🔥 REQUIRED for Render
    },
  });

  await transporter.sendMail({
    from: `"Trade Developers & Protectors" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
