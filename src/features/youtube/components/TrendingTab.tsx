"use client";

import { useState } from "react";
import { Loader2, RefreshCw, Search } from "lucide-react";

import ViralVideoGrid from "@/components/youtube/ViralVideoGrid";
import ViralCommentsList from "@/components/youtube/ViralCommentsList";
import ViralOverview from "@/components/youtube/ViralOverview";
import CommentsModal from "@/components/common/CommentsModal";
import { useViralVideos } from "../hooks/useViralVideos";

const LIMIT_OPTIONS = [10, 20, 50, 100];

export default function YoutubeTrendingTab() {
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

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setQ(search.trim());
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-slate-900">Video Viral</h2>
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
              Menampilkan <span className="font-semibold text-slate-700">{data.items?.length ?? 0}</span> dari{" "}
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

          <CommentsModal
            open={!!selectedVideo}
            onClose={() => setSelectedVideoId(null)}
            url={selectedVideo?.url}
            caption={selectedVideo?.title}
          >
            {selectedVideo && <ViralCommentsList data={selectedVideo.comments} />}
          </CommentsModal>
        </>
      )}
    </div>
  );
}
