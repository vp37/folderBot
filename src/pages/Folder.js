import React, { useState, useEffect ,useRef} from "react";
import "../App.css";

function FileExplorerChat() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const API_BASE = "http://127.0.0.1:8000/api";

  const messagesEndRef = useRef(null);

   useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Common prompts/responses
  const COMMON_RESPONSES = {
    "good morning": "Good morning! 🌞",
    hello: "Hello there! 👋",
    hi: "Hi! How can I help you today?",
    hey: "Hey! How's it going? 😃",
    "how are you": "I'm a bot, but I'm doing great! 😄",
    "good night": "Good night! 🌙 Sleep well.",
    thanks: "You're welcome! 😊",
    "thank you": "No problem! 👍",
    "what's up": "Not much, just here to help you! 😎",
    "how is your day": "My day is running smoothly, thanks for asking! 🤖",
    bye: "Goodbye! 👋 Have a great day!",
    "see you": "See you later! 👀",
    "good afternoon": "Good afternoon! ☀️",
    "good evening": "Good evening! 🌇",
    sorry: "No worries! It's all good. 😌",
    congratulations: "🎉 Congratulations! Well done!",
    "happy birthday": "🎂 Happy Birthday! Hope you have a wonderful day!",
    welcome: "You're welcome! 😄",
    ok: "👍 Got it!",
    yes: "✅ Yes!",
    no: "❌ No!",
    help: "Sure! How can I assist you? 🤖",
  };

  // Toggle dark mode
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Add message to chat
  const addMessage = (sender, text, type = "text", data = null) => {
    setMessages((prev) => [...prev, { sender, text, type, data }]);
  };

  // Initial load: show top-level folders/files
  useEffect(() => {
    const loadRootNodes = async () => {
      try {
        const res = await fetch(`${API_BASE}/nodes/?path=`);
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          addMessage("bot", `Top-level folders and files:`, "results", data.items);
        }
      } catch (error) {
        addMessage("bot", "Error loading root folders/files");
      }
    };
    loadRootNodes();
  }, []);

  // Handle user query
  const handleQuery = async () => {
    if (!query.trim()) return;
    const userQuery = query;
    const lowerQuery = query.toLowerCase();

    // 1️⃣ Common prompts
    for (const key in COMMON_RESPONSES) {
      if (lowerQuery.includes(key)) {
        addMessage("user", userQuery);
        addMessage("bot", COMMON_RESPONSES[key]);
        setQuery("");
        return;
      }
    }

    // 2️⃣ Open folder
    try {
      const folderRes = await fetch(`${API_BASE}/nodes/?path=${query}`);
      const folderData = await folderRes.json();

      if (folderData.items && folderData.items.length > 0) {
        addMessage("user", `Open folder: ${query}`);
        addMessage("bot", `Contents of "${query}":`, "results", folderData.items);
        setQuery("");
        return;
      }
    } catch (err) {}

    // 3️⃣ Search files
    try {
      const res = await fetch(`${API_BASE}/search/?q=${query}`);
      const data = await res.json();
      addMessage("user", `Search: ${query}`);

      if (!data.results || data.results.length === 0) {
        addMessage("bot", `No files found for "${query}".`);
      } else {
        addMessage("bot", `Search results for "${query}":`, "results", data.results);
      }
      setQuery("");
    } catch (error) {
      addMessage("bot", `Error searching for "${query}"`);
    }
  };

  const openFolder = async (path) => {
    addMessage("user", `Open folder: ${path}`);
    try {
      const res = await fetch(`${API_BASE}/nodes/?path=${path}`);
      const data = await res.json();

      if (!data.items || data.items.length === 0) {
        addMessage("bot", `Folder "${path}" is empty.`);
        return;
      }

      addMessage("bot", `Contents of "${path}":`, "results", data.items);
    } catch (error) {
      addMessage("bot", `Error opening folder "${path}"`);
    }
  };

  // 🔹 Instead of embedding, we give download link
  const openFile = async (path) => {
    addMessage("user", `Open file: ${path}`);
    addMessage("bot", "Click below link to download/open file:", "download", {
      name: path.split("/").pop(),
      url: `${API_BASE}/download/?path=${encodeURIComponent(path)}`,
    });
  };

  return (
    <div className={`chat-container ${darkMode ? "dark" : "light"}`}>
      <div className="theme-toggle">
        <h1>FileBot...🚀</h1>
        <button onClick={toggleDarkMode}>{darkMode ? "🌞" : "🌙"}</button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className="message">
            {/* Text messages */}
            {msg.type === "text" && (
              <div
                className={msg.sender === "user" ? "user-bubble" : "bot-bubble"}
              >
                {msg.text}
              </div>
            )}

            {/* Results (folders/files) */}
            {msg.type === "results" && (
              <div className="bot-bubble results-list">
                <p>{msg.text}</p>
                <ul>
                  {msg.data.map((item) => (
                    <li
                      key={item.path}
                      onClick={() =>
                        item.type === "folder"
                          ? openFolder(item.path)
                          : openFile(item.path)
                      }
                    >
                      {item.type === "folder" ? "📂" : "📄"} {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Download link */}
            {msg.type === "download" && (
              <div className="bot-bubble">
                <a
                  href={msg.data.url}
                  download={msg.data.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📥 {msg.data.name}
                </a>
              </div>
            )}
          </div>
        ))}
            <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type folder name, file query or say hello..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleQuery()}
        />
        <button onClick={handleQuery}>Send</button>
      </div>
    </div>
  );
}

export default FileExplorerChat;
