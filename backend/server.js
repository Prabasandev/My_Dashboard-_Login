const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const db = require("./db");
const sendEmailOTP = require("./emailSender"); // ✅ make sure this file is correct

const app = express();
const PORT = 5000;
const otpStore = {}; // In-memory store: { email: otp }

app.use(cors());
app.use(express.json());

console.log("🔍 server.js loaded");

// Log all requests
app.use((req, res, next) => {
  console.log("→", req.method, req.url);
  next();
});

// ✅ Ping
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

// ✅ Register user
app.post("/api/register", async (req, res) => {
  const { username, password, email, phone } = req.body;

  try {
    const [existing] = await db.promise().query(
      "SELECT * FROM users WHERE email = ? OR phone = ?",
      [email, phone]
    );

    if (existing.length > 0) {
      return res.json({ success: false, message: "Email or phone already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.promise().query(
      "INSERT INTO users (username, password, email, phone) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, email, phone]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ success: false, message: "Server error during registration." });
  }
});

// ✅ Login
app.post("/api/login", async (req, res) => {
  const { username: email, password } = req.body;

  try {
    const [rows] = await db.promise().query(
      "SELECT password FROM users WHERE email = ?",
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, rows[0].password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, message: "Login error" });
  }
});

// ✅ Send OTP via email
app.post("/api/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ success: false, message: "Invalid email address." });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  try {
    await sendEmailOTP(email, otp);
    res.json({ success: true, message: "OTP sent to your email." });
  } catch (err) {
    console.error("OTP Email Error:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP." });
  }
});

// ✅ Verify OTP
app.post("/api/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] === otp) {
    return res.json({ success: true });
  }

  res.status(401).json({ success: false, message: "Invalid OTP." });
});

// ✅ Reset password
app.post("/api/reset-password", async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.promise().query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, email]
    );

    delete otpStore[email];
    res.json({ success: true, message: "Password reset successfully." });
  } catch (err) {
    console.error("Reset Error:", err);
    res.status(500).json({ success: false, message: "Failed to reset password." });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
