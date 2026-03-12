import prisma from "@/lib/db"
import DonateForm from "@/components/DonateForm"

const CAMPAIGN_EMOJIS: Record<string, string> = {
  yatim: "🤲", masjid: "🕌", buka: "🌙", renovasi: "🏗️", dhuafa: "💝",
}
function getCampaignEmoji(title: string) {
  const lower = title.toLowerCase()
  for (const [key, emoji] of Object.entries(CAMPAIGN_EMOJIS)) {
    if (lower.includes(key)) return emoji
  }
  return "🕌"
}

export default async function CampaignDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const campaign = await prisma.campaign.findUnique({ where: { id } })

  if (!campaign) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "#f0f7f0" }}>
        <div className="text-center">
          <div className="text-5xl mb-3">😕</div>
          <h1 className="text-xl font-bold text-gray-700">Campaign tidak ditemukan</h1>
          <p className="text-gray-400 text-sm mt-1">Campaign sudah berakhir atau tidak ada.</p>
        </div>
      </main>
    )
  }

  const pct = Math.min(Math.round((campaign.collectedAmount / campaign.targetAmount) * 100), 100)
  const remaining = Math.max(campaign.targetAmount - campaign.collectedAmount, 0)
  const emoji = getCampaignEmoji(campaign.title)

  return (
    <main className="min-h-screen pb-32" style={{ background: "#f0f7f0" }}>

      {/* HERO */}
      <div className="px-5 pt-12 pb-24 rounded-b-[48px] shadow-xl relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #1a6b1c 0%, #16a34a 100%)" }}>
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/10" />

        <span className="relative inline-block bg-white/20 border border-white/30 text-white text-xs font-bold px-3 py-1 rounded-full mb-5">
          ✅ Campaign Aktif
        </span>

        <div className="relative w-16 h-16 rounded-3xl flex items-center justify-center text-3xl mb-4 shadow-lg"
          style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)" }}>
          {emoji}
        </div>

        <h1 className="relative text-white font-bold text-2xl leading-tight mb-2">{campaign.title}</h1>
        <p className="relative text-green-100 text-sm leading-relaxed">{campaign.description}</p>
      </div>

      {/* PROGRESS CARD — overlap hero */}
      <div className="mx-5 -mt-14 bg-white rounded-3xl p-5 shadow-xl relative z-10">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Terkumpul</p>
            <p className="text-green-600 font-bold text-xl">Rp {campaign.collectedAmount.toLocaleString("id-ID")}</p>
          </div>
          <div className="bg-green-500 text-white text-sm font-bold px-3 py-1.5 rounded-2xl shadow-md">
            {pct}%
          </div>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-3 mb-3 overflow-hidden">
          <div className="h-3 rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: "linear-gradient(90deg, #22c55e, #16a34a)" }} />
        </div>

        <div className="flex justify-between">
          <div>
            <p className="text-xs text-gray-400">Target</p>
            <p className="text-xs font-bold text-gray-700">Rp {campaign.targetAmount.toLocaleString("id-ID")}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Sisa</p>
            <p className="text-xs font-bold text-gray-700">Rp {remaining.toLocaleString("id-ID")}</p>
          </div>
        </div>
      </div>

      {/* TENTANG */}
      <div className="mx-5 mt-4 bg-white rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-5 rounded-full bg-green-500" />
          <h2 className="font-bold text-gray-800 text-sm">Tentang Campaign</h2>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed">{campaign.description}</p>
      </div>

      {/* DONATE FORM */}
      <div className="mx-5 mt-4 bg-white rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full bg-yellow-400" />
          <h2 className="font-bold text-gray-800 text-sm">💝 Donasi Sekarang</h2>
        </div>
        <DonateForm campaignId={campaign.id} />
      </div>

    </main>
  )
}