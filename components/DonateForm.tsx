"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const MAYAR_LINK = "https://cleo-firman.myr.id/pl/donasi-donyar"
const QUICK_AMOUNTS = [10000, 25000, 50000, 100000, 250000, 500000]

export default function DonateForm({ campaignId }: { campaignId: string }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [donating, setDonating] = useState(false)

  const handleDonate = async () => {
    const num = parseInt(amount)
    if (!num || num < 1000) { alert("Minimal donasi Rp 1.000"); return }
    if (!session) { router.push("/login"); return }

    setDonating(true)
    await fetch("/api/donation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId, amount: num, userId: session.user.id }),
    })
    window.location.href = `${MAYAR_LINK}?amount=${num}`
  }

  const num = parseInt(amount)
  const valid = num >= 1000

  return (
    <div className="flex flex-col gap-3">
      {/* QUICK AMOUNTS */}
      <div className="grid grid-cols-3 gap-2">
        {QUICK_AMOUNTS.map((q) => {
          const selected = amount === q.toString()
          return (
            <button key={q} onClick={() => setAmount(q.toString())}
              className={`py-3 rounded-2xl text-xs font-bold transition-all active:scale-95 ${
                selected ? "text-white shadow-lg" : "bg-gray-50 text-gray-600 border border-gray-200"
              }`}
              style={selected ? { background: "linear-gradient(135deg, #22c55e, #16a34a)" } : {}}>
              {q >= 1000000 ? `${q/1000000}jt` : `${q/1000}rb`}
            </button>
          )
        })}
      </div>

      {/* CUSTOM INPUT */}
      <div className={`rounded-2xl px-4 py-3 flex items-center gap-2 border transition-all ${
        amount && !QUICK_AMOUNTS.map(String).includes(amount) && valid
          ? "border-green-400 bg-green-50"
          : "border-gray-200 bg-gray-50"
      }`}>
        <span className="text-gray-500 text-sm font-bold">Rp</span>
        <input
          type="number"
          placeholder="Nominal lainnya..."
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="flex-1 bg-transparent text-sm focus:outline-none text-gray-700"
        />
        {valid && <span className="text-green-500 text-xs font-bold">✓</span>}
      </div>

      {/* PREVIEW */}
      {valid && (
        <div className="bg-green-50 border border-green-100 rounded-2xl px-4 py-2.5 flex justify-between items-center">
          <span className="text-green-700 text-xs">Jumlah donasi</span>
          <span className="text-green-600 font-bold text-sm">Rp {num.toLocaleString("id-ID")}</span>
        </div>
      )}

      {/* BUTTON */}
      <button onClick={handleDonate} disabled={donating || !valid}
        className="w-full py-4 rounded-2xl font-bold text-white text-sm shadow-lg active:scale-95 transition-all mt-1 disabled:opacity-50"
        style={{ background: valid ? "linear-gradient(135deg, #f59e0b, #d97706)" : "#d1d5db" }}>
        {donating ? "Memproses..." : valid
          ? `💝 Donasi Rp ${num.toLocaleString("id-ID")} via Mayar`
          : "Pilih nominal dulu"}
      </button>
    </div>
  )
}