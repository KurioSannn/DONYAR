"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("Semua field harus diisi")
      return
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter")
      return
    }
    setLoading(true)
    setError("")
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error || "Gagal daftar")
    } else {
      router.push("/login")
    }
  }

return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f8faf8" }}>

      {/* TOP */}
      <div className="flex flex-col items-center justify-center pt-16 pb-16 px-6 rounded-b-[48px]"
           style={{ background: "linear-gradient(160deg, #1a6b1c 0%, #16a34a 100%)" }}>
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-yellow-300 shadow-xl p-3 mb-4">
          <Image src="/LogoDonyar.svg" alt="DONYAR" width={48} height={48} />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-widest">DONYAR</h1>
        <p className="text-green-200 text-sm mt-1">Bergabung sekarang 🌿</p>
      </div>

      {/* CARD */}
      <div className="flex-1 px-6 pt-8 pb-24">
        <h2 className="text-2xl font-bold text-gray-800">Daftar</h2>
        <p className="text-gray-400 text-sm mt-1">Buat akun baru kamu</p>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-2xl">
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Nama</label>
            <input type="text" placeholder="Nama lengkap kamu" value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Email</label>
            <input type="email" placeholder="email@kamu.com" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Password</label>
            <input type="password" placeholder="Minimal 6 karakter" value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              className="w-full border border-gray-200 bg-gray-50 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent" />
          </div>
          <button onClick={handleRegister} disabled={loading}
            className="mt-2 w-full py-4 rounded-2xl font-bold text-white shadow-lg active:scale-95 transition-all disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}>
            {loading ? "Mendaftar..." : "Daftar Sekarang →"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Udah punya akun?{" "}
          <Link href="/login" className="text-green-600 font-bold">Masuk di sini</Link>
        </p>
      </div>
    </div>
  )
}