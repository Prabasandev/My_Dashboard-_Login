const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmailOTP(toEmail, otp) {
  const mailOptions = {
  from: `Venba Bakery <${process.env.EMAIL_USER}>`, // ✅ Add name before email
  to: toEmail,
  subject: "Your OTP Code",
  text: `Your OTP code is: ${otp}`,
};


  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("❌ Email send error:", error.message);
    throw error;
  }
}

module.exports = sendEmailOTP;