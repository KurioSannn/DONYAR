"use client"

import { useState, useRef, useEffect } from "react"

type Message = {
  role: "user" | "model"
  text: string
}

const QUICK_PROMPTS = [
  "Saya ingin donasi untuk anak yatim 🤲",
  "Campaign apa yang paling butuh bantuan?",
  "Berikan motivasi donasi Ramadhan 🌙",
  "Rekomendasikan campaign untuk saya",
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Assalamualaikum! 👋 Saya Donyar AI, siap membantu kamu menemukan campaign donasi terbaik. Mau donasi untuk apa hari ini? 🌿",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMsg: Message = { role: "user", text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput("")
    setLoading(true)

    try {
      // Format history untuk Gemini (exclude pesan pertama AI)
      const history = newMessages.slice(1, -1).map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      }))

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      })

      const data = await res.json()
      setMessages((prev) => [...prev, { role: "model", text: data.reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "Maaf, ada gangguan. Coba lagi ya! 🙏" },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white flex flex-col pb-24">

      {/* HEADER */}
      <div className="bg-green-600 px-6 pt-12 pb-5 rounded-b-3xl shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
            🤖
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Donyar AI</h1>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              <p className="text-green-100 text-xs">Online • Siap membantu</p>
            </div>
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 px-4 py-4 overflow-y-auto space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "model" && (
              <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center text-sm mr-2 mt-1 shrink-0">
                🤖
              </div>
            )}
            <div
              className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === "user"
                  ? "bg-green-500 text-white rounded-tr-sm"
                  : "bg-gray-100 text-gray-800 rounded-tl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* LOADING BUBBLE */}
        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center text-sm mr-2 mt-1">
              🤖
            </div>
            <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* QUICK PROMPTS */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => sendMessage(prompt)}
              className="bg-green-50 border border-green-200 text-green-700 text-xs px-3 py-2 rounded-full font-medium hover:bg-green-100 transition"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* INPUT */}
      <div className="px-4 pb-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="Ketik pesan..."
          className="flex-1 border border-gray-200  text-gray-500 bg-gray-50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          className="bg-green-500 hover:bg-green-600 disabled:opacity-40 transition text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm active:scale-95"
        >
          <span className="text-lg">→</span>
        </button>
      </div>

    </main>
  )
}