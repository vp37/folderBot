import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/Login.css";

// Redux
import { useDispatch } from "react-redux";
import { setAuthToken, setAuthUser } from "../redux/authSlice";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/bot/signup/", {
        username:name,
        email,
        password,
      });
      const { access, refresh, user } = response.data;

      // Fallback if backend does not return user object
      const userData = user || { name, email };

      // Save JWT in cookies (10 days expiry)
      Cookies.set("access_token", access, { expires: 10 });
      Cookies.set("refresh_token", refresh, { expires: 10 });

      // Save token & user in Redux
      dispatch(setAuthToken(access));
      dispatch(setAuthUser(userData));

      toast.success("Signup successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Signup failed. Try again!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <ToastContainer />
      <div className="left-side">EGPS</div>
      <div className="right-side">
        <div className="login-card">
          <h2 className="login-title">Create Account</h2>
          <form className="login-form" onSubmit={handleSignup}>
            <label>Name</label>
            <input
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing up..." : "Signup"}
            </button>
          </form>

          <p className="signup-text">
            Already have an account?{" "}
            <NavLink to="/login" className="signup-link">
              Login
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
