import prisma from "@/lib/db"
import DonateForm from "@/components/DonateForm"

export default async function CampaignDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const campaign = await prisma.campaign.findUnique({
    where: { id },
  })

  if (!campaign) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-800">Campaign tidak ditemukan</h1>
          <p className="text-gray-500 mt-2">Campaign yang kamu cari tidak ada atau sudah berakhir.</p>
        </div>
      </main>
    )
  }

  const progress = (campaign.collectedAmount / campaign.targetAmount) * 100

  return (
    <main className="min-h-screen bg-white text-gray-800 p-6">

      {/* HEADER */}
      <div className="mt-8">
        <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
          Campaign Aktif
        </span>

        <h1 className="text-3xl font-bold text-green-600 mt-3 leading-tight">
          {campaign.title}
        </h1>

        <p className="mt-3 text-gray-500 leading-relaxed">
          {campaign.description}
        </p>
      </div>

      {/* PROGRESS CARD */}
      <div className="mt-8 bg-green-50 rounded-2xl p-6 shadow-sm">

        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Terkumpul</p>
            <p className="text-2xl font-bold text-green-600">
              Rp {campaign.collectedAmount.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Target</p>
            <p className="text-lg font-semibold text-gray-700">
              Rp {campaign.targetAmount.toLocaleString("id-ID")}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-green-200 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <div className="flex justify-between items-center mt-2">
          <p className="text-sm font-semibold text-green-700">
            {Math.round(progress)}% tercapai
          </p>
          <p className="text-xs text-gray-400">
            Sisa: Rp {Math.max(campaign.targetAmount - campaign.collectedAmount, 0).toLocaleString("id-ID")}
          </p>
        </div>

      </div>

      {/* DONATE SECTION */}
      <div className="mt-8 bg-yellow-50 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-yellow-700 mb-1">
          Yuk Berdonasi! 💛
        </h2>
        <p className="text-gray-500 text-sm mb-4">
          Setiap donasi kamu sangat berarti untuk campaign ini.
        </p>
        <DonateForm campaignId={campaign.id} />
      </div>

    </main>
  )
}