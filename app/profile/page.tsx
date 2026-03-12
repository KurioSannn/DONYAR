"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type Donation = {
  id: string
  amount: number
  status: string
  createdAt: string
  campaign: { title: string }
}

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [editName, setEditName] = useState(false)
  const [newName, setNewName] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (status === "loading") return
    if (!session) { router.push("/login"); return }
    setNewName(session.user.name || "")
    fetch(`/api/donation?userId=${session.user.id}`)
      .then(r => r.json())
      .then(data => { setDonations(data); setLoading(false) })
  }, [status, session])

  const handleSaveName = async () => {
    if (!newName.trim()) return
    setSaving(true)
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    })
    await update({ name: newName })
    setSaving(false)
    setEditName(false)
  }

  if (status === "loading" || loading) return (
    <div className="flex h-screen items-center justify-center" style={{ background: "#f0f7f0" }}>
      <div className="text-green-600 font-bold animate-pulse">Loading...</div>
    </div>
  )

  const totalDonasi = donations.reduce((acc, d) => acc + d.amount, 0)
  const initial = session?.user?.name?.[0]?.toUpperCase() || "U"

  return (
    <main className="min-h-screen pb-28" style={{ background: "#f0f7f0" }}>

      {/* HEADER */}
      <div className="px-6 pt-14 pb-8 rounded-b-[48px]"
        style={{ background: "linear-gradient(160deg, #1a6b1c 0%, #16a34a 100%)" }}>

        <p className="text-white font-bold text-lg text-center mb-6">Profil Saya</p>

        {/* AVATAR */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-3xl bg-white/20 border-2 border-white/40 flex items-center justify-center shadow-xl mb-3">
            <span className="text-4xl font-bold text-white">{initial}</span>
          </div>

          {editName ? (
            <div className="flex gap-2 items-center mt-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-white/20 border border-white/40 rounded-xl px-3 py-2 text-white text-sm focus:outline-none w-36 text-center"
                placeholder="Nama baru"
              />
              <button onClick={handleSaveName} disabled={saving}
                className="bg-yellow-400 text-gray-800 px-3 py-2 rounded-xl text-xs font-bold">
                {saving ? "..." : "Simpan"}
              </button>
              <button onClick={() => setEditName(false)}
                className="bg-white/20 text-white px-3 py-2 rounded-xl text-xs font-bold">
                Batal
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-2">
              <p className="text-white font-bold text-xl">{session?.user?.name}</p>
              <button onClick={() => setEditName(true)} className="bg-white/20 rounded-lg p-1.5">
                <span className="text-sm">✏️</span>
              </button>
            </div>
          )}

          <p className="text-green-200 text-sm mt-1">{session?.user?.email}</p>
          <span className={`mt-3 px-4 py-1.5 rounded-full text-xs font-bold ${
            session?.user?.role === "admin" ? "bg-yellow-400 text-gray-800" : "bg-white/20 text-white"
          }`}>
            {session?.user?.role === "admin" ? "⚙️ Admin" : "👤 User"}
          </span>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-3 px-5 mt-5">
        <div className="bg-white rounded-3xl p-5 shadow-sm text-center">
          <p className="text-3xl font-bold text-green-600">{donations.length}</p>
          <p className="text-xs text-gray-400 mt-1 font-medium">Total Donasi</p>
        </div>
        <div className="bg-white rounded-3xl p-5 shadow-sm text-center">
          <p className="text-base font-bold text-yellow-500">Rp {totalDonasi.toLocaleString("id-ID")}</p>
          <p className="text-xs text-gray-400 mt-1 font-medium">Total Nominal</p>
        </div>
      </div>

      {/* RIWAYAT */}
      <div className="px-5 mt-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-5 rounded-full bg-green-500" />
          <h2 className="font-bold text-gray-700">Riwayat Donasi</h2>
        </div>

        {donations.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm">
            <div className="text-4xl mb-2">🌿</div>
            <p className="text-gray-500 font-semibold text-sm">Belum ada donasi</p>
            <p className="text-gray-400 text-xs mt-1">Yuk mulai berdonasi!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {donations.map((d) => (
              <div key={d.id} className="bg-white rounded-3xl p-4 shadow-sm flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: "linear-gradient(135deg, #dcfce7, #bbf7d0)" }}>
                  💝
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-sm truncate">{d.campaign.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(d.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-green-600 text-sm">Rp {d.amount.toLocaleString("id-ID")}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-0.5 inline-block ${
                    d.status === "success" ? "bg-green-100 text-green-600"
                    : d.status === "pending" ? "bg-yellow-100 text-yellow-600"
                    : "bg-red-100 text-red-500"
                  }`}>
                    {d.status === "success" ? "✓ Sukses" : d.status === "pending" ? "⏳ Pending" : "✕ Gagal"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LOGOUT */}
      <div className="px-5 mt-5">
        <button onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full bg-white border border-red-100 text-red-500 py-4 rounded-3xl font-bold shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2">
          <span>🚪</span> Keluar
        </button>
      </div>

    </main>
  )
}