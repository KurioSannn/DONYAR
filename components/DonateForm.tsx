"use client"

import { useState } from "react"

const QUICK_AMOUNTS = [10000, 25000, 50000, 100000]
const MAYAR_LINK = "https://cleo-firman.myr.id/pl/donasi-donyar"

export default function DonateForm({ campaignId }: { campaignId: string }) {
  const [amount, setAmount] = useState("")

  const handleDonate = () => {
    if (!amount || Number(amount) <= 0) {
      alert("Masukkan jumlah donasi dulu ya!")
      return
    }
    // Redirect ke Mayar dengan amount sebagai parameter
    const url = `${MAYAR_LINK}?amount=${amount}`
    window.open(url, "_blank")
  }

  return (
    <div className="bg-yellow-50 border border-yellow-100 p-5 rounded-2xl">

      <h2 className="text-lg font-bold text-yellow-700">
        💛 Donasi Sekarang
      </h2>

      <p className="text-xs text-gray-400 mt-1">
        Pembayaran aman via Mayar 🔒
      </p>

      {/* NOMINAL CEPAT */}
      <div className="grid grid-cols-4 gap-2 mt-4">
        {QUICK_AMOUNTS.map((nominal) => (
          <button
            key={nominal}
            onClick={() => setAmount(String(nominal))}
            className={`text-xs py-2 rounded-xl font-semibold border transition-all ${
              amount === String(nominal)
                ? "bg-yellow-400 border-yellow-400 text-white"
                : "bg-white border-yellow-200 text-yellow-700 hover:bg-yellow-100"
            }`}
          >
            {nominal >= 1000 ? `${nominal / 1000}rb` : nominal}
          </button>
        ))}
      </div>

      {/* INPUT MANUAL */}
      <input
        type="number"
        placeholder="Atau masukkan nominal lain..."
        className="mt-3 w-full border  text-gray-500 border-yellow-200 bg-white p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      {amount && (
        <p className="text-xs text-gray-500 mt-1 ml-1">
          Rp {Number(amount).toLocaleString("id-ID")}
        </p>
      )}

      <button
        onClick={handleDonate}
        className="mt-4 w-full bg-green-500 hover:bg-green-600 active:scale-95 transition-all text-white py-3 rounded-xl font-bold shadow-sm flex items-center justify-center gap-2"
      >
        <span>Donasi via Mayar</span>
        <span>→</span>
      </button>

      <p className="text-center text-xs text-gray-400 mt-2">
        Kamu akan diarahkan ke halaman pembayaran Mayar
      </p>

    </div>
  )
}