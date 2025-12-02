"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  async function sendMessage() {
    if (!input.trim()) return;

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    setMessages([...messages, { from: "user", text: input }]);
    setMessages((m) => [...m, { from: "bot", text: data.reply }]);

    setInput("");
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>AI Chatbot</h1>

      <div style={{ marginBottom: 20 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: "10px 0" }}>
            <b>{m.from === "user" ? "Bạn" : "AI"}:</b> {m.text}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ padding: 10, width: "300px" }}
      />
      <button onClick={sendMessage} style={{ padding: 10 }}>
        Gửi
      </button>
    </div>
  );
}
