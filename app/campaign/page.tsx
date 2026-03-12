import Link from "next/link"
import prisma from "@/lib/db"

export default async function CampaignPage() {
  const campaigns = await prisma.campaign.findMany()

  return (
    <main className="min-h-screen bg-white text-gray-800 p-6">

      {/* HEADER */}
      <div className="mt-8 mb-8">
        <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
          Semua Campaign
        </span>
        <h1 className="text-3xl font-bold text-green-600 mt-2">
          Campaign Donasi
        </h1>
        <p className="text-gray-500 mt-1">Pilih campaign yang ingin kamu dukung</p>
      </div>

      {/* CAMPAIGN LIST */}
      <div className="grid gap-5">
        {campaigns.map((c) => {
          const progress = Math.min((c.collectedAmount / c.targetAmount) * 100, 100)

          return (
            <Link href={`/campaign/${c.id}`} key={c.id}>
              <div className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden cursor-pointer flex">

                {/* GAMBAR KIRI */}
                <div className="w-28 min-h-full bg-green-100 shrink-0 flex items-center justify-center">
                  <span className="text-5xl">🌿</span>
                </div>

                {/* KETERANGAN KANAN */}
                <div className="flex-1 p-4">

                  <h2 className="text-base font-bold text-gray-800 leading-snug">
                    {c.title}
                  </h2>

                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                    {c.description}
                  </p>

                  {/* PROGRESS */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span className="font-semibold text-green-600">
                        Rp {c.collectedAmount.toLocaleString("id-ID")}
                      </span>
                      <span>
                        dari Rp {c.targetAmount.toLocaleString("id-ID")}
                      </span>
                    </div>

                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-700"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <p className="text-xs text-gray-400 mt-1">
                      {Math.round(progress)}% tercapai
                    </p>
                  </div>

                </div>

              </div>
            </Link>
          )
        })}
      </div>

    </main>
  )
}