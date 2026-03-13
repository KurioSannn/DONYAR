"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Campaign = {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  collectedAmount: number;
  donations: any[];
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Campaign | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.push("/");
      return;
    }
    fetchCampaigns();
  }, [status, session]);

  const fetchCampaigns = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/campaign");
    const data = await res.json();
    setCampaigns(data);
    setLoading(false);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTargetAmount("");
    setEditTarget(null);
    setShowForm(false);
  };

  const handleEdit = (c: Campaign) => {
    setEditTarget(c);
    setTitle(c.title);
    setDescription(c.description);
    setTargetAmount(String(c.targetAmount));
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!title || !description || !targetAmount) return;
    setSaving(true);

    if (editTarget) {
      await fetch(`/api/admin/campaign/${editTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, targetAmount }),
      });
    } else {
      await fetch("/api/admin/campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, targetAmount }),
      });
    }

    setSaving(false);
    resetForm();
    fetchCampaigns();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus campaign ini?")) return;
    await fetch("/api/admin/campaign", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchCampaigns();
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-green-600 font-bold animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* HEADER */}
      <div className="bg-green-600 px-6 pt-12 pb-5 rounded-b-3xl shadow-md">
        <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-white text-xs font-semibold">
          Admin Panel
        </span>
        <h1 className="text-white font-bold text-2xl mt-2">Dashboard Admin</h1>
        <p className="text-green-100 text-sm mt-1">
          Kelola campaign donasi DONYAR
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-3 px-6 mt-5">
        <div className="bg-green-50 rounded-2xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-green-600">
            {campaigns.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total Campaign</p>
        </div>
        <div className="bg-yellow-50 rounded-2xl p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {campaigns.reduce((acc, c) => acc + c.donations.length, 0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total Donasi</p>
        </div>
      </div>

      {/* FORM TAMBAH / EDIT */}
      {showForm && (
        <div className="px-6 mt-5">
          <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
            <h2 className="font-bold text-green-700 mb-4">
              {editTarget ? "✏️ Edit Campaign" : "➕ Tambah Campaign"}
            </h2>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Judul campaign"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border  text-gray-500 border-green-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <textarea
                placeholder="Deskripsi campaign"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full border  text-gray-500 border-green-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
              />
              <input
                type="number"
                placeholder="Target donasi (Rp)"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full border  text-gray-500 border-green-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
              />

              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white py-3 rounded-xl font-bold transition active:scale-95"
                >
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
                <button
                  onClick={resetForm}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-3 rounded-xl font-bold transition"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOMBOL TAMBAH */}
      {!showForm && (
        <div className="px-6 mt-5">
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-yellow-400 hover:bg-yellow-300 active:scale-95 transition text-gray-800 py-3 rounded-2xl font-bold shadow-sm"
          >
            ➕ Tambah Campaign Baru
          </button>
        </div>
      )}

      {/* LIST CAMPAIGN */}
      <div className="px-6 mt-5 grid gap-3">
        <h2 className="font-bold text-gray-700">Semua Campaign</h2>
        {campaigns.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-gray-100 shadow-sm rounded-2xl p-4"
          >
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 truncate">{c.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                  {c.description}
                </p>
              </div>
              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium shrink-0">
                {c.donations.length} donasi
              </span>
            </div>

            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span className="text-green-600 font-semibold">
                  Rp {c.collectedAmount.toLocaleString("id-ID")}
                </span>
                <span>Target: Rp {c.targetAmount.toLocaleString("id-ID")}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${Math.min((c.collectedAmount / c.targetAmount) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(c)}
                className="flex-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 py-2 rounded-xl text-xs font-semibold transition"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-xl text-xs font-semibold transition"
              >
                🗑️ Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
