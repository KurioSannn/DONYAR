"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

type Campaign = {
  id: string
  title: string
  description: string
  targetAmount: number
  collectedAmount: number
}

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])

  useEffect(() => {
    if (status === "loading") return
    if (!session) { router.push("/login"); return }
    fetch("/api/campaign").then(r => r.json()).then(setCampaigns)
  }, [status, session])

  if (status === "loading") return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-green-600 font-bold animate-pulse">Loading...</div>
    </div>
  )

  const firstName = session?.user?.name?.split(" ")[0] || "Kamu"
  const hour = new Date().getHours()
  const greeting = hour < 11 ? "Selamat pagi" : hour < 15 ? "Selamat siang" : hour < 18 ? "Selamat sore" : "Selamat malam"

  return (
    <main className="min-h-screen pb-24" style={{ background: "#f0f7f0" }}>

      {/* HERO */}
      <div className="px-5 pt-12 pb-8 rounded-b-[40px] shadow-lg"
        style={{ background: "linear-gradient(160deg, #1a6b1c 0%, #16a34a 100%)" }}>

        {/* TOP BAR */}
{/* TOP BAR */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-green-200 text-x+">{greeting} 👋</p>
            <p className="text-white font-bold text-3xl">{firstName}</p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-yellow-400 rounded-2xl px-3 py-2">
            <Image src="/LogoDonyar.svg" alt="DONYAR" width={22} height={22} />
            <span className="text-yellow-400 font-bold text-sm tracking-wider">DONYAR</span>
          </div>
        </div>

{/* HERO CARD */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-5 mt-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-yellow-400 text-gray-800 text-xs font-bold px-3 py-1 rounded-full">🤖 AI-Powered</span>
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">Ramadhan 1447H</span>
          </div>
          <h1 className="text-white font-bold text-3xl leading-tight mb-2">Platform Donasi<br/>Cerdas Indonesia 🌿</h1>
          <p className="text-green-200 text-sm mb-5">Temukan campaign terbaik dengan bantuan AI</p>
          <div className="flex gap-3">
            <Link href="/campaign"
              className="flex-1 bg-yellow-400 text-gray-800 font-bold text-sm py-3.5 rounded-2xl text-center active:scale-95 transition-all shadow-lg">
              Explore Campaign →
            </Link>
            <Link href="/ai"
              className="bg-white/20 border border-white/30 text-white font-bold text-sm py-3.5 px-5 rounded-2xl text-center active:scale-95 transition-all">
              🤖 AI
            </Link>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-2 px-5 -mt-5">
        {[
          { value: `${campaigns.length}+`, label: "Campaign" },
          { value: "500+", label: "Donatur" },
          { value: "50jt+", label: "Terkumpul" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-3 text-center shadow-md">
            <p className="text-green-600 font-bold text-base">{s.value}</p>
            <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* CAMPAIGN TERBARU */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-800 text-base">Campaign Aktif 🌙</h2>
          <Link href="/campaign" className="text-green-600 text-xs font-bold">Lihat semua →</Link>
        </div>

        {campaigns.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center shadow-sm">
            <div className="text-4xl mb-2">🌿</div>
            <p className="text-gray-400 text-sm">Belum ada campaign</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {campaigns.slice(0, 3).map((c) => {
              const pct = Math.min(Math.round((c.collectedAmount / c.targetAmount) * 100), 100)
              return (
                <Link key={c.id} href={`/campaign/${c.id}`}>
                  <div className="bg-white rounded-3xl p-4 shadow-sm active:scale-[0.98] transition-all">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                        style={{ background: "linear-gradient(135deg, #dcfce7, #bbf7d0)" }}>
                        🌙
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 text-sm leading-tight">{c.title}</h3>
                        <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{c.description}</p>
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-green-600 font-bold">Rp {c.collectedAmount.toLocaleString("id-ID")}</span>
                            <span className="text-gray-400">{pct}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full transition-all"
                              style={{ width: `${pct}%`, background: "linear-gradient(90deg, #22c55e, #16a34a)" }} />
                          </div>
                          <p className="text-gray-400 text-xs mt-1">Target: Rp {c.targetAmount.toLocaleString("id-ID")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* AI BANNER */}
      <div className="px-5 mt-5">
        <Link href="/ai">
          <div className="rounded-3xl p-5 flex items-center justify-between active:scale-[0.98] transition-all shadow-md"
            style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}>
            <div>
              <p className="text-white font-bold text-sm">Bingung mau donasi apa? 🤖</p>
              <p className="text-green-200 text-xs mt-0.5">Tanya Donyar AI sekarang</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">🤖</div>
          </div>
        </Link>
      </div>

    </main>
  )
}