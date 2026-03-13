import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  return (
    <main className="min-h-screen pb-24" style={{ background: "#f0f7f0" }}>

      {/* HERO */}
      <div className="px-5 pt-16 pb-16 text-center rounded-b-[48px] shadow-xl relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #1a6b1c 0%, #16a34a 100%)" }}>
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/10" />

        <div className="relative flex justify-center mb-4">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center border border-white/30 shadow-xl p-4">
            <Image src="/LogoDonyar.svg" alt="DONYAR" width={52} height={52} />
          </div>
        </div>

        <h1 className="relative text-white font-bold text-4xl tracking-widest mb-2">DONYAR</h1>
        <p className="relative text-green-200 text-sm mb-1">Platform Donasi Cerdas Powered by AI</p>
        <span className="relative inline-block bg-yellow-400 text-gray-800 text-xs font-bold px-3 py-1 rounded-full mt-2">
          🏆 Mayar VibeCoding Ramadhan 2026
        </span>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-3 px-5 mt-5">
        {[
          { value: "3+", label: "Campaign Aktif" },
          { value: "500+", label: "Donatur" },
          { value: "50jt+", label: "Terkumpul" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <p className="text-green-600 font-bold text-lg">{s.value}</p>
            <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* FITUR */}
      <div className="px-5 mt-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full bg-green-500" />
          <h2 className="font-bold text-gray-800">Kenapa DONYAR?</h2>
        </div>

        <div className="flex flex-col gap-3">
          {[
            { icon: "🤖", title: "AI Donation Recommendation", desc: "Donyar AI membantu kamu menemukan campaign donasi yang paling sesuai dengan niat dan kebutuhanmu.", color: "#dcfce7" },
            { icon: "🔒", title: "Secure Payment via Mayar", desc: "Pembayaran donasi aman dan terpercaya menggunakan platform Mayar yang telah terverifikasi.", color: "#fef9c3" },
            { icon: "📊", title: "Transparent Campaign", desc: "Semua campaign bisa dipantau progress donasinya secara real-time dan transparan.", color: "#dbeafe" },
            { icon: "🌙", title: "Ramadhan Special", desc: "Dirancang khusus untuk memudahkan donasi di bulan Ramadhan yang penuh berkah.", color: "#fce7f3" },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-3xl p-4 shadow-sm flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: f.color }}>
                {f.icon}
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">{f.title}</p>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TECH STACK */}
      <div className="px-5 mt-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full bg-yellow-400" />
          <h2 className="font-bold text-gray-800">Tech Stack</h2>
        </div>
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            {[
              "⚡ Next.js 15", "🎨 Tailwind CSS",
              "🗄️ PostgreSQL", "🔐 NextAuth.js",
              "🤖 Gemini AI", "💳 Mayar Payment",
              "☁️ Vercel", "🛢️ Supabase",
            ].map((tech) => (
              <div key={tech} className="bg-gray-50 rounded-2xl px-3 py-2.5 text-xs font-bold text-gray-700 text-center">
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 mt-6">
        <Link href="/login">
          <div className="rounded-3xl p-5 text-center shadow-lg active:scale-[0.98] transition-all"
            style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}>
            <p className="text-white font-bold text-lg mb-1">Mulai Berdonasi 💝</p>
            <p className="text-green-200 text-sm">Bergabung dan jadikan Ramadhan lebih bermakna</p>
            <div className="mt-3 bg-yellow-400 text-gray-800 font-bold text-sm py-2.5 px-6 rounded-2xl inline-block">
              Masuk / Daftar →
            </div>
          </div>
        </Link>
      </div>

      {/* FOOTER */}
      <div className="text-center mt-8 pb-5">
        <p className="text-gray-400 text-xs">Made with 💚 for Mayar VibeCoding Ramadhan 2026</p>
        <p className="text-gray-300 text-xs mt-1">© 2026 DONYAR. All rights reserved.</p>
      </div>

    </main>
  )
}