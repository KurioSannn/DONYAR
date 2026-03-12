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
  const { data: session, status } = useSession()
  const router = useRouter()
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/login")
      return
    }
    fetchDonations()
  }, [status, session])

  const fetchDonations = async () => {
    const res = await fetch(`/api/donation?userId=${session?.user?.id}`)
    const data = await res.json()
    setDonations(data)
    setLoading(false)
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-green-600 font-bold animate-pulse">Loading...</div>
      </div>
    )
  }

  const totalDonasi = donations.reduce((acc, d) => acc + d.amount, 0)

  return (
    <main className="min-h-screen bg-white pb-24">

      {/* HEADER PROFIL */}
      <div className="bg-green-600 px-6 pt-12 pb-8 rounded-b-3xl shadow-md text-center">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl mx-auto">
          👤
        </div>
        <h1 className="text-white font-bold text-xl mt-3">
          {session?.user?.name}
        </h1>
        <p className="text-green-100 text-sm mt-1">
          {session?.user?.email}
        </p>
        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
          session?.user?.role === "admin"
            ? "bg-yellow-400 text-gray-800"
            : "bg-white/20 text-white"
        }`}>
          {session?.user?.role === "admin" ? "⚙️ Admin" : "👤 User"}
        </span>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-3 px-6 mt-5">
        <div className="bg-green-50 rounded-2xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-green-600">{donations.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total Donasi</p>
        </div>
        <div className="bg-yellow-50 rounded-2xl p-4 shadow-sm text-center">
          <p className="text-lg font-bold text-yellow-600">
            Rp {totalDonasi.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total Nominal</p>
        </div>
      </div>

      {/* RIWAYAT DONASI */}
      <div className="px-6 mt-6">
        <h2 className="font-bold text-gray-700 mb-3">Riwayat Donasi</h2>

        {donations.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl mb-2">🌿</div>
            <p className="text-gray-400 text-sm">Belum ada donasi</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {donations.map((d) => (
              <div key={d.id} className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-lg shrink-0">
                  🌿
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">
                    {d.campaign.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(d.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric", month: "short", year: "numeric"
                    })}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-green-600 text-sm">
                    Rp {d.amount.toLocaleString("id-ID")}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    d.status === "success"
                      ? "bg-green-100 text-green-600"
                      : d.status === "pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-500"
                  }`}>
                    {d.status === "success" ? "Sukses" : d.status === "pending" ? "Pending" : "Gagal"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LOGOUT */}
      <div className="px-6 mt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 hover:bg-red-100 active:scale-95 transition text-red-500 py-3 rounded-2xl font-bold border border-red-100"
        >
          🚪 Keluar
        </button>
      </div>

    </main>
  )
}