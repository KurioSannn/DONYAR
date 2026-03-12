import SplashScreen from "@/components/SplashScreen"
import Link from "next/link"

export default function Home() {
  return (
    <SplashScreen>
      <main className="min-h-screen bg-white text-gray-800 pb-24">

        {/* HERO */}
        <section className="bg-green-600 px-6 pt-16 pb-12 text-center rounded-b-3xl shadow-md">
          <div className="inline-block bg-white/20 px-4 py-1 rounded-full text-white text-xs font-semibold tracking-widest mb-4">
            POWERED BY AI 🤖
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tight">
            DONYAR
          </h1>
          <p className="mt-3 text-green-100 text-sm">
            Platform donasi cerdas untuk Ramadhan yang bermakna
          </p>
          <Link href="/campaign">
            <button className="mt-6 bg-yellow-400 hover:bg-yellow-300 active:scale-95 transition-all px-8 py-3 rounded-2xl font-bold text-gray-800 shadow-lg">
              Explore Campaign 🌿
            </button>
          </Link>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-3 gap-3 px-6 mt-6">
          {[
            { label: "Campaign", value: "12+" },
            { label: "Donatur", value: "500+" },
            { label: "Terkumpul", value: "50jt+" },
          ].map((stat) => (
            <div key={stat.label} className="bg-green-50 rounded-2xl p-3 text-center shadow-sm">
              <p className="text-xl font-bold text-green-600">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </section>

        {/* FEATURES */}
        <section className="px-6 mt-8 grid gap-4">
          <h2 className="text-lg font-bold text-gray-700">Kenapa DONYAR?</h2>

          {[
            {
              bg: "bg-green-50",
              title: "🤖 AI Donation Recommendation",
              titleColor: "text-green-700",
              desc: "AI membantu menemukan campaign terbaik yang sesuai niat donasi kamu.",
            },
            {
              bg: "bg-yellow-50",
              title: "🔒 Secure Payment",
              titleColor: "text-yellow-700",
              desc: "Pembayaran donasi aman dan terpercaya menggunakan platform Mayar.",
            },
            {
              bg: "bg-green-50",
              title: "📊 Transparent Campaign",
              titleColor: "text-green-700",
              desc: "Semua campaign bisa dipantau progress donasinya secara real-time.",
            },
          ].map((f) => (
            <div key={f.title} className={`${f.bg} p-5 rounded-2xl shadow-sm`}>
              <h3 className={`font-bold ${f.titleColor}`}>{f.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* CTA AI */}
        <section className="px-6 mt-6">
          <Link href="/ai">
            <div className="bg-green-600 rounded-2xl p-5 text-white shadow-md flex items-center justify-between">
              <div>
                <p className="font-bold text-lg">Tanya AI dulu? 🤖</p>
                <p className="text-green-100 text-sm mt-1">Biar AI bantu pilihkan campaign terbaik buat kamu</p>
              </div>
              <span className="text-3xl">→</span>
            </div>
          </Link>
        </section>

      </main>
    </SplashScreen>
  )
}