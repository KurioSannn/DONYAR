"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email dan password harus diisi");
      return;
    }
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Email atau password salah");
    } else {
      router.push("/");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#f8faf8" }}
    >
      {/* TOP */}
      <div
        className="flex flex-col items-center justify-center pt-16 pb-16 px-6 rounded-b-[48px]"
        style={{
          background: "linear-gradient(160deg, #1a6b1c 0%, #16a34a 100%)",
        }}
      >
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-yellow-400 shadow-xl p-3 mb-4">
          <Image src="/LogoDonyar.svg" alt="DONYAR" width={48} height={48} />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-widest">
          DONYAR
        </h1>
        <p className="text-green-200 text-sm mt-1">Platform donasi cerdas</p>
      </div>

      {/* CARD */}
      <div className="flex-1 px-6 pt-8 pb-24">
        <h2 className="text-2xl font-bold text-gray-800">Masuk</h2>
        <p className="text-gray-400 text-sm mt-1">Selamat datang kembali 👋</p>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-2xl">
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
              Email
            </label>
            <input
              type="email"
              placeholder="email@kamu.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-gray-500 border border-gray-200 bg-gray-50 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full border text-gray-500 border-gray-200 bg-gray-50 rounded-2xl px-4 py-3.5 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-green-600 transition-colors"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-2 w-full py-4 rounded-2xl font-bold text-white shadow-lg active:scale-95 transition-all disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}
          >
            {loading ? "Masuk..." : "Masuk →"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Belum punya akun?{" "}
          <Link href="/register" className="text-green-600 font-bold">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
