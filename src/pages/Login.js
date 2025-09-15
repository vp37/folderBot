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

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/bot/login/", {
        email,
        password,
      });

      console.log(response.data); // for debugging

      const { access, refresh, user } = response.data;

      // Save tokens in cookies (10 days expiry)
      Cookies.set("access_token", access, { expires: 10 });
      Cookies.set("refresh_token", refresh, { expires: 10 });

      // Save token & user in Redux
      dispatch(setAuthToken(access));
      dispatch(setAuthUser(user));

      toast.success("Login successful!");
      setTimeout(() => navigate("/bot"), 1000);
    } catch (error) {
      console.error(error.response?.data);
      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      toast.error(errorMessage);
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
          <h2 className="login-title">Login</h2>

          <form className="login-form" onSubmit={handleLogin}>
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

            <div className="login-options">
              <NavLink to="/forgot-password" className="forgot-link">
                Forgot Password?
              </NavLink>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="signup-text">
            New user?{" "}
            <NavLink to="/signup" className="signup-link">
              Create Account
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
