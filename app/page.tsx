"use client";

import { useState, KeyboardEvent } from "react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    const botMsg: Message = { sender: "bot", text: data.reply };
    setMessages((prev) => [...prev, botMsg]);

    setInput("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Chatbot dùng Groq API (Free)</h1>

      <div
        style={{
          border: "1px solid #ccc",
          padding: 10,
          height: 400,
          overflowY: "auto",
        }}
      >
        {messages.map((m, i) => (
          <p
            key={i}
            style={{ textAlign: m.sender === "user" ? "right" : "left" }}
          >
            <strong>{m.sender === "user" ? "Bạn" : "AI"}:</strong> {m.text}
          </p>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          width: "80%",
          marginTop: 10,
          padding: 8,
          border: "1px solid #ccc",
        }}
        placeholder="Nhập tin nhắn…"
      />

      <button
        onClick={sendMessage}
        style={{
          marginLeft: 10,
          padding: 8,
          borderRadius: 4,
          border: "1px solid #ccc",
        }}
      >
        Gửi
      </button>
    </div>
  );
}
