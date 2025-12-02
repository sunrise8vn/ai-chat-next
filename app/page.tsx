"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll xuống cuối khi có message mới
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botMsg: Message = { sender: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Error:", err);
      const errorMsg: Message = { sender: "bot", text: "Có lỗi xảy ra!" };
      setMessages((prev) => [...prev, errorMsg]);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  }

  // Tùy chỉnh ReactMarkdown để highlight code
  const renderers = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      const isDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

      return !inline && match ? (
        <SyntaxHighlighter
          style={isDark ? oneDark : oneLight}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div
      style={{
        margin: "0 auto",
        color: "var(--text-color)",
        background: "var(--bg-color)",
        minHeight: "100vh",
        transition: "background 0.3s, color 0.3s",
      }}
    >
      <h1>Trợ lý học tập Edumall xin chào !</h1>
      <p>
        Hãy nhập câu hỏi hoặc yêu cầu của bạn bên dưới để nhận trợ giúp từ AI.
      </p>
      <br />
      <div
        style={{
          border: "1px solid #ccc",
          padding: 10,
          height: 450,
          overflowY: "auto",
          borderRadius: 8,
          background: "var(--chat-bg-color)",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.sender === "user" ? "right" : "left",
              margin: "10px 0",
            }}
          >
            <div
              style={{
                display: "inline-block",
                background:
                  m.sender === "user"
                    ? "var(--user-bubble-bg)"
                    : "var(--bot-bubble-bg)",
                padding: "8px 12px",
                borderRadius: 12,
                maxWidth: "70%",
                textAlign: "left",
                wordBreak: "break-word",
              }}
            >
              <strong>{m.sender === "user" ? "Bạn" : "AI"}:</strong>
              <ReactMarkdown components={renderers}>{m.text}</ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div style={{ marginTop: 10, display: "flex" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            padding: 8,
            border: "1px solid #ccc",
            borderRadius: 4,
            background: "var(--input-bg)",
            color: "var(--text-color)",
          }}
          placeholder="Nhập tin nhắn…"
        />
        <button
          onClick={sendMessage}
          style={{
            marginLeft: 10,
            padding: "8px 16px",
            borderRadius: 4,
            border: "1px solid #ccc",
            cursor: "pointer",
            background: "var(--button-bg)",
            color: "var(--button-text)",
          }}
        >
          Gửi
        </button>
      </div>

      {/* CSS variables cho chế độ sáng/tối */}
      <style jsx global>{`
        :root {
          --bg-color: #ffffff;
          --text-color: #000000;
          --chat-bg-color: #fafafa;
          --user-bubble-bg: #dcf8c6;
          --bot-bubble-bg: #f1f0f0;
          --input-bg: #ffffff;
          --button-bg: #f0f0f0;
          --button-text: #000000;
        }

        @media (prefers-color-scheme: dark) {
          :root {
            --bg-color: #1e1e1e;
            --text-color: #e0e0e0;
            --chat-bg-color: #2c2c2c;
            --user-bubble-bg: #4b6e4e;
            --bot-bubble-bg: #3a3a3a;
            --input-bg: #2c2c2c;
            --button-bg: #3a3a3a;
            --button-text: #e0e0e0;
          }
        }
      `}</style>
    </div>
  );
}
