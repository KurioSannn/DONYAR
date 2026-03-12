"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email dan password harus diisi")
      return
    }

    setLoading(true)
    setError("")

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      setError("Email atau password salah")
    } else {
      router.push("/")
    }
  }

  return (
    <main className="min-h-screen bg-white flex flex-col pb-24">

      {/* HEADER */}
      <div className="bg-green-600 px-6 pt-12 pb-8 rounded-b-3xl shadow-md text-center">
        <h1 className="text-3xl font-bold text-white">DONYAR</h1>
        <p className="text-green-100 text-sm mt-1">Masuk ke akun kamu</p>
      </div>

      {/* FORM */}
      <div className="px-6 mt-8 flex flex-col gap-4">

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div>
          <label className="text-sm font-semibold text-gray-600 mb-1 block">Email</label>
          <input
            type="email"
            placeholder="email@kamu.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border text-gray-500 border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-600 mb-1 block">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full border text-gray-500 border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full  bg-green-500 hover:bg-green-600 disabled:opacity-50 transition text-white py-3 rounded-xl font-bold shadow-sm active:scale-95 mt-2"
        >
          {loading ? "Masuk..." : "Masuk 🌿"}
        </button>

        <p className="text-center text-sm text-gray-400 mt-2">
          Belum punya akun?{" "}
          <Link href="/register" className="text-green-600 font-semibold">
            Daftar sekarang
          </Link>
        </p>

      </div>
    </main>
  )
}