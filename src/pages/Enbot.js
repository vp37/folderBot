import React, { useState, useRef, useEffect, useCallback, memo } from "react";
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

// -------------------- Message Row (Memoized) --------------------
const MessageRow = memo(({ sender, text }) => {
  return (
    <div className={`message-row ${sender}`}>
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
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );
});

// -------------------- Chat Component --------------------
function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const BACKEND_URL =
    process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000";

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

  // Ensure user is logged in
  useEffect(() => {
    if (!token) navigate("/login");
  }, [navigate, token]);

  // Load chat history
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

  // -------------------- Auto-resize helper --------------------
  const autoResizeTextarea = (textarea) => {
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + "px";
  };

  // -------------------- Send message --------------------
  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
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

      const botReply = { sender: "bot", text: res.data.reply || "..." };
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error: Could not reach server." },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [input, token, userId, BACKEND_URL, navigate]);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);
  

  return (
    <div className={`App ${darkMode ? "dark" : "light"}`}>
      <div className="chat-window">
        {messages.map((msg, i) => (
          <MessageRow key={i} sender={msg.sender} text={msg.text} />
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
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            autoResizeTextarea(e.target);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type your message..."
          rows={1}
          style={{ resize: "none", overflowY: "auto" }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;
