"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

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
    <main className="min-h-screen bg-white flex flex-col pb-24">

      {/* HEADER */}
      <div className="bg-green-600 px-6 pt-12 pb-8 rounded-b-3xl shadow-md text-center">
        <h1 className="text-3xl font-bold text-white">DONYAR</h1>
        <p className="text-green-100 text-sm mt-1">Buat akun baru</p>
      </div>

      {/* FORM */}
      <div className="px-6 mt-8 flex flex-col gap-4">

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div>
          <label className="text-sm font-semibold text-gray-600 mb-1 block">Nama</label>
          <input
            type="text"
            placeholder="Nama lengkap kamu"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border text-gray-500 border-gray-200 bg-bgreen-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-600 mb-1 block">Email</label>
          <input
            type="email"
            placeholder="email@kamu.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border  text-gray-500 border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-600 mb-1 block">Password</label>
          <input
            type="password"
            placeholder="Minimal 6 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
            className="w-full border  text-gray-500 border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 transition text-white py-3 rounded-xl font-bold shadow-sm active:scale-95 mt-2"
        >
          {loading ? "Mendaftar..." : "Daftar Sekarang 🌿"}
        </button>

        <p className="text-center text-sm text-gray-400 mt-2">
          Udah punya akun?{" "}
          <Link href="/login" className="text-green-600 font-semibold">
            Masuk di sini
          </Link>
        </p>

      </div>
    </main>
  )
}