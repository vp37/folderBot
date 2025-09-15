import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "../context/Themecontext";
import { useSelector } from "react-redux";
import "../css/Enbot.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const BACKEND_URL =
    process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000";

  // ------------------- Get token & userId -------------------
  const token = Cookies.get("access_token");
  const reduxUser = useSelector((state) => state.auth.user);

  // Decode userId if not in Redux
  let userId = reduxUser?.id;
  if (!userId && token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.user_id;
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  // ------------------- Ensure user is logged in -------------------
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);

  // ------------------- Load chat history -------------------
  useEffect(() => {
    const fetchMessages = async () => {
      if (!token || !userId) return;
      try {
        const res = await axios.get(`${BACKEND_URL}/bot/signup/${userId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const chatHistory = res.data.message.map((msg) => ({
          sender: msg.role === "user" ? "user" : "bot",
          text: msg.content,
        }));

        setMessages(chatHistory);
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      }
    };

    fetchMessages();
  }, [token, userId, BACKEND_URL]);

  // ------------------- Send message -------------------
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const res = await axios.post(
        `${BACKEND_URL}/bot/chat/`,
        { message: input, user: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages([
        ...newMessages,
        { sender: "bot", text: res.data.reply || "..." },
      ]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { sender: "bot", text: "⚠️ Error: Could not reach server." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // ------------------- Auto scroll -------------------
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ------------------- Render -------------------
  return (
    <div className={`App ${darkMode ? "dark" : "light"}`}>
      <div className="chat-window">
        {messages.map((msg, i) => (
          <div key={i} className={`message-row ${msg.sender}`}>
            <div className="message-text">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="inline-code" {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {msg.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message-row bot">
            <div className="message-text typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
