"use client";

import { useState } from "react";
import { Loader2, RefreshCw, Search } from "lucide-react";

import ViralVideoGrid from "@/components/youtube/ViralVideoGrid";
import ViralCommentsList from "@/components/youtube/ViralCommentsList";
import ViralOverview from "@/components/youtube/ViralOverview";
import VisualsPreviewWidget from "@/components/youtube/VisualsPreviewWidget";
import CommentsModal from "@/components/common/CommentsModal";
import { useViralVideos } from "../hooks/useViralVideos";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const LIMIT_OPTIONS = [10, 20, 50, 100];
type SortBy = "rank" | "newest";

export default function YoutubeTrendingTab() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("rank");

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

  const sortedItems = !data?.items
    ? []
    : sortBy === "rank"
      ? data.items
      : [...data.items].sort(
          (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
        );

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setQ(search.trim());
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t.youtubeTrendingTab.title}</h2>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
          {t.youtubeTrendingTab.subtitle}
        </p>
      </div>

      {/* Filter bar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <form onSubmit={handleSearch} className="flex-1">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {t.youtubeTrendingTab.searchLabel}
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                placeholder={t.youtubeTrendingTab.searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
              />
            </div>
          </form>

          <div className="shrink-0">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {t.youtubeTrendingTab.sortLabel}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 text-sm text-slate-800 dark:text-slate-200 focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            >
              <option value="rank">{t.youtubeTrendingTab.sortRank}</option>
              <option value="newest">{t.youtubeTrendingTab.sortNewest}</option>
            </select>
          </div>

          <div className="shrink-0">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {t.youtubeTrendingTab.countLabel}
            </label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 text-sm text-slate-800 dark:text-slate-200 focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            >
              {LIMIT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt} {t.youtubeTrendingTab.countUnit}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => refetch()}
            disabled={loading}
            className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            {t.accountSentimentTab.refreshButton}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/40 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-white dark:bg-slate-900 py-24 shadow-sm">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-indigo-600" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">{t.youtubeTrendingTab.loadingTitle}</p>
        </div>
      )}

      {!loading && !error && data && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t.youtubeTrendingTab.showingPrefix} <span className="font-semibold text-slate-700 dark:text-slate-300">{data.items?.length ?? 0}</span> {t.youtubeTrendingTab.showingMiddle}{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">{data.total}</span> {t.youtubeTrendingTab.showingSuffix}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">{data.note}</p>
          </div>

          <ViralOverview stats={data.stats} sentiment={data.sentiment} />

          <VisualsPreviewWidget items={sortedItems} />

          <ViralVideoGrid
            data={sortedItems}
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
