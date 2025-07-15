import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (step === 4) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 100); // short delay before redirect

      return () => clearTimeout(timer);
    }
  }, [step, navigate]);

  const sendOTP = async () => {
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/send-otp", { email });
      if (res.data.success) {
        setStep(2);
      } else {
        setError(res.data.message);
      }
    } catch {
      setError("Failed to send OTP");
    }
  };

  const verifyOTP = async () => {
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/verify-otp", { email, otp });
      if (res.data.success) {
        setStep(3);
      } else {
        setError(res.data.message);
      }
    } catch {
      setError("OTP verification failed");
    }
  };

  const resetPassword = async () => {
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/reset-password", { email, password });
      if (res.data.success) {
        setStep(4); // triggers redirect
      } else {
        setError(res.data.message);
      }
    } catch {
      setError("Password reset failed");
    }
  };

  return (
    <div className="register-wrapper" style={{ display: "flex", justifyContent: "center" }}>
      {step === 1 && (
        <div className="register-box" style={{ width: "300px" }}>
          <h3>Forgot Password</h3>
          <label className="register-label">Email Address*</label>
          <input
            type="email"
            className="register-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <button className="register-btn" onClick={sendOTP}>
            Send OTP
          </button>
          {error && <p className="error-msg">{error}</p>}
        </div>
      )}

      {step === 2 && (
        <div className="register-box" style={{ width: "300px" }}>
          <h3>Verify OTP</h3>
          <label className="register-label">Enter OTP*</label>
          <input
            type="text"
            className="register-input"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
            placeholder="Enter OTP"
          />
          <button className="register-btn" onClick={verifyOTP}>
            Verify OTP
          </button>
          {error && <p className="error-msg">{error}</p>}
        </div>
      )}

      {step === 3 && (
        <div className="register-box" style={{ width: "300px" }}>
          <h3>Reset Password</h3>
          <label className="register-label">New Password*</label>
          <input
            type="password"
            className="register-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
          />
          <label className="register-label">Confirm Password*</label>
          <input
            type="password"
            className="register-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
          />
          <button className="register-btn" onClick={resetPassword}>
            Reset Password
          </button>
          {error && <p className="error-msg">{error}</p>}
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;
