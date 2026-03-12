import prisma from "@/lib/db"

export default async function RiwayatPage() {
  // Sementara ambil semua donasi (nanti bisa difilter by user setelah login)
  const donations = await prisma.donation.findMany({
    include: {
      campaign: true,
      user: true,
    },
    orderBy: { createdAt: "desc" },
  })

  const totalDonasi = donations.reduce((acc, d) => acc + d.amount, 0)

  return (
    <main className="min-h-screen bg-white text-gray-800 pb-24">

      {/* HEADER */}
      <div className="bg-green-600 px-6 pt-12 pb-5 rounded-b-3xl shadow-md">
        <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-white text-xs font-semibold tracking-wide">
          Riwayat
        </span>
        <h1 className="text-white font-bold text-2xl mt-2">
          Riwayat Donasi
        </h1>
        <p className="text-green-100 text-sm mt-1">
          Semua donasi yang telah dilakukan
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-3 px-6 mt-5">
        <div className="bg-green-50 rounded-2xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-green-600">{donations.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total Transaksi</p>
        </div>
        <div className="bg-yellow-50 rounded-2xl p-4 shadow-sm text-center">
          <p className="text-lg font-bold text-yellow-600">
            Rp {totalDonasi.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total Donasi</p>
        </div>
      </div>

      {/* LIST */}
      <div className="px-6 mt-6 grid gap-3">
        {donations.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🌿</div>
            <p className="text-gray-400 font-medium">Belum ada donasi</p>
            <p className="text-gray-300 text-sm mt-1">Yuk mulai berdonasi!</p>
          </div>
        ) : (
          donations.map((d) => (
            <div
              key={d.id}
              className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4 flex items-center gap-4"
            >
              {/* ICON */}
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl shrink-0">
                🌿
              </div>

              {/* INFO */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">
                  {d.campaign.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {d.user.name} • {new Date(d.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* AMOUNT + STATUS */}
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
          ))
        )}
      </div>

    </main>
  )
}