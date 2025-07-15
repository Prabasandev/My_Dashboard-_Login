import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import "./LoginPage.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMsg("Please enter both username and password.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      });

      if (res.data.success) {
        setErrorMsg("");
        navigate("/dashboard");
      } else {
        setErrorMsg("Incorrect username or password.");
      }
    } catch (err) {
      setErrorMsg("Login error. Please try again later.");
    }
  };

const handleGoogleSuccess = (credentialResponse) => {
  try {
    const decoded = jwtDecode(credentialResponse.credential);
    console.log("✅ Google User:", decoded);
    navigate("/dashboard");
  } catch (err) {
    console.error("Google login decoding error:", err);
  }
};

  const handleGoogleFailure = () => {
    setErrorMsg("Google login failed. Please try again.");
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="login-logo-wrapper">
          <img src="/baking.jpeg" alt="Logo" className="login-logo" />
        </div>

        <h2 className="login-title">Sign in</h2>
        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        <label className="login-label">Username or Email</label>
        <input
          className="login-input"
          type="text"
          placeholder="you@example.com"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="login-label">Password</label>
        <input
          className="login-input"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="login-options">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />{" "}
            Remember me
          </label>
          <Link to="/forgot-password" className="forgot-link">
            Forgot password?
          </Link>
        </div>

        <button className="login-btn" onClick={handleLogin}>
          Log In
        </button>

        <div style={{ textAlign: "center", margin: "15px 0" }}>or</div>

        {/* ✅ Google Login Button */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} />
        </div>

        <div className="create-account">
          New to this site? <Link to="/register">Create an account →</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
