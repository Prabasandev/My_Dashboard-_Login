import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const validatePassword = (value) => {
    const newErrors = {};
    if (!value) newErrors.password = "Password is required.";
    else if (value.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrors({});

    if (!validatePassword(formData.password)) return;

    try {
      const res = await axios.post("http://localhost:5000/api/register", formData);

      if (res.data.success) {
        setSuccessMsg("✅ Account created successfully. Redirecting...");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setErrors({ api: res.data.message || "Registration failed." });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ api: "❌ Registration failed. Please try again." });
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-box">
        <div className="register-logo-wrapper">
          <img src="/baking.jpeg" alt="Logo" className="register-logo" />
        </div>

        <h2>Create your account</h2>

        {errors.api && <p className="error-msg">{errors.api}</p>}
        {successMsg && <p className="success-msg">{successMsg}</p>}

        <form onSubmit={handleRegister} noValidate>
          <label className="register-label">Username</label>
          <input
            type="text"
            name="username"
            className="register-input"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleInputChange}
          />

          <label className="register-label">Email address</label>
          <input
            type="email"
            name="email"
            className="register-input"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <label className="register-label">Mobile Number</label>
          <input
            type="text"
            name="phone"
            className="register-input"
            placeholder="Enter your mobile number"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />

          <label className="register-label">Password</label>
          <input
            type="password"
            name="password"
            className="register-input"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          {errors.password && <p className="error-msg">{errors.password}</p>}

          <button type="submit" className="register-btn">
            Create Account
          </button>
        </form>

        <p className="signin-link">
          Already have an account? <Link to="/">Sign in →</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
