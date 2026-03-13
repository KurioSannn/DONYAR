"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Message = { role: "user" | "assistant"; content: string };

const QUICK = [
  "Saya ingin donasi untuk anak yatim 🤲",
  "Campaign apa yang paling butuh bantuan?",
  "Berikan motivasi donasi Ramadhan 🌙",
  "Rekomendasikan campaign untuk saya",
];

// Parse teks AI: pisah teks biasa vs campaign card
function parseMessage(content: string) {
  const parts: Array<
    | { type: "text"; text: string }
    | { type: "campaign"; id: string; title: string }
  > = [];
  const regex = /\[CAMPAIGN:([^:]+):([^\]]+)\]/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", text: content.slice(lastIndex, match.index) });
    }
    parts.push({ type: "campaign", id: match[1], title: match[2] });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push({ type: "text", text: content.slice(lastIndex) });
  }

  return parts;
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Assalamualaikum! 👋 Saya Donyar AI, siap membantu kamu menemukan campaign donasi terbaik. Mau donasi untuk apa hari ini? 🌿",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Maaf, ada gangguan. Coba lagi ya! 🙏" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const showQuick = messages.length <= 1;

  return (
    <main className="flex flex-col h-screen" style={{ background: "#f0f7f0" }}>
      {/* HEADER */}
      <div
        className="px-5 pt-12 pb-4 flex items-center gap-3 rounded-b-4xl shadow-md"
        style={{
          background: "linear-gradient(160deg, #1a6b1c 0%, #16a34a 100%)",
        }}
      >
        <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-2xl">
          🤖
        </div>
        <div>
          <h1 className="text-white font-bold">Donyar AI</h1>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
            <span className="text-green-200 text-xs">
              Online • Siap membantu
            </span>
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "assistant" && (
              <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center text-sm shrink-0 mt-0.5">
                🤖
              </div>
            )}
            <div className={`max-w-[82%] flex flex-col gap-2`}>
              {/* Bubble teks */}
              {parseMessage(m.content).map((part, j) =>
                part.type === "text" && part.text.trim() ? (
                  <div
                    key={j}
                    className={`px-4 py-3 rounded-3xl text-sm leading-relaxed ${
                      m.role === "user"
                        ? "text-white rounded-tr-none"
                        : "bg-white text-gray-700 shadow-sm rounded-tl-none"
                    }`}
                    style={
                      m.role === "user"
                        ? {
                            background:
                              "linear-gradient(135deg, #22c55e, #16a34a)",
                          }
                        : {}
                    }
                  >
                    {part.text}
                  </div>
                ) : part.type === "campaign" ? (
                  // Campaign card langsung bisa diklik
                  <Link key={j} href={`/campaign/${part.id}`}>
                    <div className="bg-white border border-green-200 rounded-2xl p-3 shadow-sm flex items-center gap-3 active:scale-[0.98] transition-all">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                        }}
                      >
                        🕌
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800 text-sm">
                          {part.title}
                        </p>
                        <p className="text-green-600 text-xs mt-0.5">
                          Tap untuk donasi →
                        </p>
                      </div>
                    </div>
                  </Link>
                ) : null,
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2 justify-start">
            <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center text-sm shrink-0">
              🤖
            </div>
            <div className="bg-white rounded-3xl rounded-tl-none px-4 py-3 shadow-sm flex gap-1 items-center">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {showQuick && !loading && (
          <div className="flex flex-col gap-2 mt-2">
            {QUICK.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-left bg-white border border-green-100 text-gray-700 text-sm px-4 py-3 rounded-2xl shadow-sm active:scale-[0.98] transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="px-4 py-3 pb-28 bg-white/80 backdrop-blur-md border-t border-gray-100">
        <div className="flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ketik pesan..."
            className="flex-1 bg-transparent text-sm focus:outline-none text-gray-700"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold disabled:opacity-40 transition-all active:scale-90"
            style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}
          >
            →
          </button>
        </div>
      </div>
    </main>
  );
}
