import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "../navbar/Navbar.css";
import { FaBars, FaTimes, FaPlus, FaSearch, FaMoon, FaSun } from "react-icons/fa";
import companyLogo from "../../images/egps3.jpg";
import { useTheme } from "../../context/Themecontext";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { darkMode, setDarkMode } = useTheme();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const token = Cookies.get("access_token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    Cookies.remove("access_token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className={`app-layout ${darkMode ? "dark" : "light"}`}>
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-header">
          {sidebarOpen && <img src={companyLogo} alt="Logo" className="sidebar-logo" />}
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <div className="sidebar-top">
          <NavLink to="/chat" className="new-chat">
            <FaPlus className="icon" /> {sidebarOpen && "New Chat"}
          </NavLink>

          <div className="search-box">
            <FaSearch className="icon" />
            {sidebarOpen && <input type="text" placeholder="Search chats..." />}
          </div>
        </div>

        {sidebarOpen && (
          <div className="sidebar-chats">
            <ul>
              <li>
                <NavLink to="/bot" className="chat-link">Chat 1</NavLink>
              </li>
              <li>
                <NavLink to="/chat" className="chat-link">Chat 2</NavLink>
              </li>
            </ul>
          </div>
        )}

        <div className="sidebar-bottom">
          {sidebarOpen && (
            <div className="user-email">{isLoggedIn ? user?.email || "Logged in User" : "Guest"}</div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="top-navbar">
          <div className="navbar-left">
            <div className="dropdown">
              <button className="dropdown-btn">EGPS ▾</button>
              <div className="dropdown-content">
                <a href="https://egps.com/" target="_blank" rel="noreferrer">Company Website</a>
                <NavLink to="/files">Files</NavLink>
              </div>
            </div>
          </div>

          <div className="navbar-center">
            <div className="switching-options">
              <NavLink to="/bot" className={({ isActive }) => `switch-btn ${isActive ? "active" : ""}`}>
                Chatty...🤖(AI)
              </NavLink>
              <NavLink to="/" className={({ isActive }) => `switch-btn ${isActive ? "active" : ""}`}>
                FileBot
              </NavLink>
            </div>
          </div>

          <div className="navbar-right">
            <button className="mode-toggle" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            {isLoggedIn ? (
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            ) : (
              <>
                <NavLink to="/login" className="login-btn">Login</NavLink>
                <NavLink to="/signup" className="signup-btn">Signup</NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
