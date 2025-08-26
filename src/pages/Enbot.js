import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import botImage from "../images/egps3.jpg";
import "../css/Enbot.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const chatEndRef = useRef(null);
  const navigate = useNavigate(); // ✅ navigation hook

  // Backend URL
  const BACKEND_URL =
    process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000";

  const sendMessage = async () => {
    if (!input) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    try {
      const res = await axios.post(`${BACKEND_URL}/bot/chat/`, {
        message: input,
      });
      setMessages([...newMessages, { sender: "bot", text: res.data.reply }]);
      setInput("");
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { sender: "bot", text: "Error: Could not reach server." },
      ]);
    }
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={`App ${darkMode ? "dark" : "light"}`}>
      {/* Header with Enbot button in center */}
      <div className="header">
        <button
          className="enbot-btn"
          onClick={() => navigate("/folder")} // ✅ navigate to /folder
        >
          FB
        </button>

        <h2>Chatty...🤖</h2>

        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "🌙" : "☀️"}
        </button>
      </div>

      {/* Chat window */}
      <div className="chat-window">
        {messages.map((msg, i) => (
          <div key={i} className={`message-row ${msg.sender}`}>
            <div className="message-text">{msg.text}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      {/* Bot image */}
      {/* <div className="chat-image">
        <img src={botImage} alt="bot" />
      </div> */}
    </div>
  );
}

export default App;
