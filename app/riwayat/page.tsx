"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Donation = {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  campaign: { title: string };
};

export default function RiwayatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }
    fetch(`/api/donation?userId=${session.user.id}`)
      .then((r) => r.json())
      .then((data) => {
        setDonations(data);
        setLoading(false);
      });
  }, [status, session]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-green-600 font-bold animate-pulse">Loading...</div>
      </div>
    );

  const total = donations.reduce((a, d) => a + d.amount, 0);

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
          📜 RIWAYAT
        </span>
        <h1 className="text-white font-bold text-2xl mt-2">Riwayat Donasi</h1>
        <p className="text-green-200 text-sm mt-0.5">
          Semua donasi yang telah dilakukan
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-3 px-5 -mt-5">
        <div className="bg-white rounded-3xl p-4 shadow-md text-center">
          <p className="text-2xl font-bold text-green-600">
            {donations.length}
          </p>
          <p className="text-xs text-gray-400 mt-1">Total Transaksi</p>
        </div>
        <div className="bg-white rounded-3xl p-4 shadow-md text-center">
          <p className="text-base font-bold text-yellow-500">
            Rp {total.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-gray-400 mt-1">Total Donasi</p>
        </div>
      </div>

      {/* LIST */}
      <div className="px-5 mt-5">
        {donations.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center shadow-sm">
            <div className="text-5xl mb-3">🌿</div>
            <p className="text-gray-600 font-semibold">Belum ada donasi</p>
            <p className="text-gray-400 text-sm mt-1">Yuk mulai berdonasi!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {donations.map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-3xl p-4 shadow-sm flex items-center gap-3"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                  }}
                >
                  💝
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-sm truncate">
                    {d.campaign.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(d.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-green-600 text-sm">
                    Rp {d.amount.toLocaleString("id-ID")}
                  </p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      d.status === "success"
                        ? "bg-green-100 text-green-600"
                        : d.status === "pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-500"
                    }`}
                  >
                    {d.status === "success"
                      ? "✓ Sukses"
                      : d.status === "pending"
                        ? "⏳ Pending"
                        : "✕ Gagal"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
