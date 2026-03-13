"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Campaign = {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  collectedAmount: number;
};

export default function CampaignPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/campaign")
      .then((r) => r.json())
      .then((data) => {
        setCampaigns(data);
        setLoading(false);
      });
  }, []);

  const filtered = campaigns.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="min-h-screen pb-24" style={{ background: "#f0f7f0" }}>
      {/* HEADER */}
      <div
        className="px-5 pt-12 pb-8 rounded-b-[40px]"
        style={{
          background: "linear-gradient(160deg, #1a6b1c 0%, #16a34a 100%)",
        }}
      >
        <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
          🌙 RAMADHAN 1447H
        </span>
        <h1 className="text-white font-bold text-2xl mt-2">Campaign Donasi</h1>
        <p className="text-green-200 text-sm mt-0.5">
          Pilih campaign yang ingin kamu dukung
        </p>

        {/* SEARCH */}
        <div className="mt-4 bg-white/15 border border-white/20 rounded-2xl flex items-center px-4 gap-2">
          <span className="text-white/70 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Cari campaign..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-white/60 text-sm py-3 focus:outline-none"
          />
        </div>
      </div>

      {/* LIST */}
      <div className="px-5 mt-5">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-green-600 font-bold animate-pulse">
              Loading...
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm mt-4">
            <div className="text-4xl mb-2">🌿</div>
            <p className="text-gray-400 text-sm">
              Tidak ada campaign ditemukan
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((c) => {
              const pct = Math.min(
                Math.round((c.collectedAmount / c.targetAmount) * 100),
                100,
              );
              const emoji = ["🕌", "🤲", "🌙", "💝", "🕋"][
                Math.floor(Math.random() * 5)
              ];
              return (
                <Link key={c.id} href={`/campaign/${c.id}`}>
                  <div className="bg-white rounded-3xl p-4 shadow-sm active:scale-[0.98] transition-all">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                        }}
                      >
                        {emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 text-sm">
                          {c.title}
                        </h3>
                        <p className="text-gray-400 text-xs mt-0.5 line-clamp-2">
                          {c.description}
                        </p>

                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-green-600 font-bold">
                              Rp {c.collectedAmount.toLocaleString("id-ID")}
                            </span>
                            <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold">
                              {pct}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${pct}%`,
                                background:
                                  "linear-gradient(90deg, #22c55e, #16a34a)",
                              }}
                            />
                          </div>
                          <div className="flex justify-between items-center mt-1.5">
                            <p className="text-gray-400 text-xs">
                              Target: Rp{" "}
                              {c.targetAmount.toLocaleString("id-ID")}
                            </p>
                            <span className="text-green-600 text-xs font-bold">
                              Donasi →
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
