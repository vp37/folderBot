import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import botImage from "../images/egps3.jpg";
import "../css/Enbot.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // loading indicator
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  const BACKEND_URL =
    process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000";

  const sendMessage = async () => {
    if (!input) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post(`${BACKEND_URL}/bot/chat/`, { message: input });
      setMessages([...newMessages, { sender: "bot", text: res.data.reply }]);
      console.log(res.data);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { sender: "bot", text: "Error: Could not reach server." }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className={`App ${darkMode ? "light" : "dark"}`}>
      {/* Header */}
      <div className="header">
        <button className="enbot-btn" onClick={() => navigate("/folder")}>FB</button>
        <h2>Chatty...🤖(AI)</h2>
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

        {/* Typing/loading indicator */}
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
    </div>
  );
}

export default App;


// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "../css/Enbot.css";

// function App() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [darkMode, setDarkMode] = useState(false);
//   const chatEndRef = useRef(null);
//   const navigate = useNavigate();

//   // Backend URL
//   const BACKEND_URL =
//     process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000";

//   // ✅ Load chat history from backend on mount
//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const res = await axios.get(`${BACKEND_URL}/bot/chat/history/`);
//         if (res.data && Array.isArray(res.data)) {
//           const formatted = res.data.map((msg) => ({
//             sender: msg.role === "user" ? "user" : "bot",
//             text: msg.content,
//           }));
//           setMessages(formatted);
//         }
//       } catch (err) {
//         console.error("Error fetching chat history:", err);
//       }
//     };
//     fetchHistory();
//   }, [BACKEND_URL]);

//   // ✅ Send message
//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const newMessages = [...messages, { sender: "user", text: input }];
//     setMessages(newMessages);

//     try {
//       const res = await axios.post(`${BACKEND_URL}/bot/chat/`, {
//         message: input,
//       });

//       const botReply = { sender: "bot", text: res.data.reply };
//       setMessages([...newMessages, botReply]);
//       setInput("");
//     } catch (err) {
//       console.error(err);
//       setMessages([
//         ...newMessages,
//         { sender: "bot", text: "Error: Could not reach server." },
//       ]);
//     }
//   };

//   // ✅ Auto-scroll to bottom
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return (
//     <div className={`App ${darkMode ? "light" : "dark"}`}>
//       {/* Header */}
//       <div className="header">
//         <button className="enbot-btn" onClick={() => navigate("/folder")}>
//           FB
//         </button>
//         <h2>Chatty...🤖(AI)</h2>
//         <button onClick={() => setDarkMode(!darkMode)}>
//           {darkMode ? "🌙" : "☀️"}
//         </button>
//       </div>

//       {/* Chat Window */}
//       <div className="chat-window">
//         {messages.map((msg, i) => (
//           <div key={i} className={`message-row ${msg.sender}`}>
//             <div className="message-text">{msg.text}</div>
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>

//       {/* Input Area */}
//       <div className="input-area">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           placeholder="Type your message..."
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// }

// export default App;

