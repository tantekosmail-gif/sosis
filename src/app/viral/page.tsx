"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Loader2, RefreshCw, Search, X } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ViralVideoGrid from "@/components/viral/ViralVideoGrid";
import ViralCommentsList from "@/components/viral/ViralCommentsList";
import ViralOverview from "@/components/viral/ViralOverview";
import { useViralVideos } from "@/features/viral/hooks/useViralVideos";

const LIMIT_OPTIONS = [10, 20, 50, 100];

export default function ViralVideoPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [search, setSearch] = useState("");

  const {
    data,
    loading,
    error,
    setQ,
    limit,
    setLimit,
    refetch,
    selectedVideoId,
    setSelectedVideoId,
    selectedVideo,
  } = useViralVideos();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setCheckingAuth(false);
  }, [router]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setQ(search.trim());
  }

  if (checkingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Viral Video</h1>
          <p className="mt-1 text-sm text-slate-400">
            Video YouTube dengan view count tertinggi dari seluruh data di database
          </p>
        </div>

        {/* Filter bar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <form onSubmit={handleSearch} className="flex-1">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Cari
              </label>
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  placeholder="Cari judul, channel, atau keyword..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                />
              </div>
            </form>

            <div className="shrink-0">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Jumlah
              </label>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
              >
                {LIMIT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt} video</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => refetch()}
              disabled={loading}
              className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center rounded-2xl border bg-white py-24 shadow-sm">
            <Loader2 className="mb-4 h-10 w-10 animate-spin text-indigo-600" />
            <p className="font-semibold text-slate-700">Memuat video viral...</p>
          </div>
        )}

        {!loading && !error && data && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Menampilkan <span className="font-semibold text-slate-700">{data.items.length}</span> dari{" "}
                <span className="font-semibold text-slate-700">{data.total}</span> video
              </p>
              <p className="text-xs text-slate-400">{data.note}</p>
            </div>

            <ViralOverview stats={data.stats} sentiment={data.sentiment} />

            <ViralVideoGrid
              data={data.items}
              selectedVideoId={selectedVideoId}
              onSelectVideo={(item) => setSelectedVideoId(item.video_id)}
            />

            {selectedVideo && (
              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-semibold text-slate-900">Komentar</h2>
                    <a
                      href={selectedVideo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 inline-flex items-center gap-1 truncate text-xs text-indigo-500 hover:text-indigo-700"
                    >
                      <span className="truncate">{selectedVideo.title}</span>
                      <ExternalLink size={10} className="shrink-0" />
                    </a>
                  </div>

                  <button
                    onClick={() => setSelectedVideoId(null)}
                    className="flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 transition"
                  >
                    <X size={12} />
                    Tutup
                  </button>
                </div>

                <ViralCommentsList data={selectedVideo.comments} />
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
