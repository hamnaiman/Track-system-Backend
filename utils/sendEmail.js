const nodemailer = require("nodemailer");

module.exports = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // 🔑 App Password
    },
  });

  await transporter.sendMail({
    from: `"Trade Developers & Protectors" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
