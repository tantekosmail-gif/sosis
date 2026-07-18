"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";

import ViralVideoGrid from "@/components/youtube/ViralVideoGrid";
import ViralCommentsList from "@/components/youtube/ViralCommentsList";
import ViralOverview from "@/components/youtube/ViralOverview";
import VideoFilterBar from "@/components/youtube/VideoFilterBar";
import CommentsModal from "@/components/common/CommentsModal";
import Pagination from "@/components/common/Pagination";
import { useViralVideos } from "../hooks/useViralVideos";
import { usePagination } from "@/hooks/usePagination";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { decodeHtmlEntities } from "@/lib/decodeHtmlEntities";
import { matchesAgeFilter, type VideoAgeFilter } from "@/lib/videoAgeFilter";
import { matchesDateRange } from "@/lib/videoDateRangeFilter";
import { aggregateViralStats } from "../lib/aggregateViralStats";

const LIMIT_OPTIONS = [10, 20, 50, 100];
type SortBy = "newest" | "views" | "negatif";

export interface TrendingTabHandle {
  search: (keyword: string) => void;
}

const YoutubeTrendingTab = forwardRef<TrendingTabHandle>(function YoutubeTrendingTab(_props, ref) {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState<SortBy>("views");
  const [filterQuery, setFilterQuery] = useState("");
  const [filterChannel, setFilterChannel] = useState("");
  const [filterTopic, setFilterTopic] = useState("");
  const [filterAge, setFilterAge] = useState<VideoAgeFilter>("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

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

  useImperativeHandle(ref, () => ({
    search: (keyword: string) => setQ(keyword),
  }));

  const sortedItems = useMemo(() => {
    if (!data?.items) return [];
    const items = [...data.items];
    if (sortBy === "newest") {
      return items.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    }
    if (sortBy === "negatif") {
      return items.sort((a, b) => b.sentiment_summary.negatif.percentage - a.sentiment_summary.negatif.percentage);
    }
    return items.sort((a, b) => b.view_count - a.view_count);
  }, [data?.items, sortBy]);

  const channelOptions = useMemo(() => {
    if (!data?.items) return [];
    return Array.from(new Set(data.items.map((item) => decodeHtmlEntities(item.channel).trim()).filter(Boolean))).sort();
  }, [data?.items]);

  const topicOptions = useMemo(() => {
    if (!data?.items) return [];
    return Array.from(new Set(data.items.map((item) => decodeHtmlEntities(item.keyword).trim()).filter(Boolean))).sort();
  }, [data?.items]);

  const filteredItems = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();
    return sortedItems.filter((item) => {
      if (q && !decodeHtmlEntities(item.title).toLowerCase().includes(q)) return false;
      if (filterChannel && decodeHtmlEntities(item.channel).trim() !== filterChannel) return false;
      if (filterTopic && decodeHtmlEntities(item.keyword).trim() !== filterTopic) return false;
      if (!matchesAgeFilter(item.published_at, filterAge)) return false;
      if (!matchesDateRange(item.published_at, filterDateFrom, filterDateTo)) return false;
      return true;
    });
  }, [sortedItems, filterQuery, filterChannel, filterTopic, filterAge, filterDateFrom, filterDateTo]);

  const { page, totalPages, setPage, paginated } = usePagination(filteredItems, 8);

  const { stats: filteredStats, sentiment: filteredSentiment } = useMemo(
    () => aggregateViralStats(filteredItems),
    [filteredItems]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t.youtubeTrendingTab.title}</h2>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
          {t.youtubeTrendingTab.subtitle}
        </p>
      </div>

      {/* Filter bar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-3">
        <VideoFilterBar
          query={filterQuery}
          onQueryChange={setFilterQuery}
          channels={channelOptions}
          channel={filterChannel}
          onChannelChange={setFilterChannel}
          topics={topicOptions}
          topic={filterTopic}
          onTopicChange={setFilterTopic}
          age={filterAge}
          onAgeChange={setFilterAge}
          dateFrom={filterDateFrom}
          onDateFromChange={setFilterDateFrom}
          dateTo={filterDateTo}
          onDateToChange={setFilterDateTo}
        />

        <div className="flex flex-col gap-3 border-t border-slate-100 pt-3 dark:border-slate-800 sm:flex-row sm:items-end">
          <div className="shrink-0">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {t.youtubeTrendingTab.sortLabel}
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 text-sm text-slate-800 dark:text-slate-200 focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            >
              <option value="newest">{t.youtubeTrendingTab.sortNewest}</option>
              <option value="views">{t.youtubeTrendingTab.sortViews}</option>
              <option value="negatif">{t.youtubeTrendingTab.sortNegatif}</option>
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

          <ViralOverview stats={filteredStats} sentiment={filteredSentiment} />

          {filteredItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-500">
              {t.videoFilterBar.noMatch}
            </div>
          ) : (
            <>
              <ViralVideoGrid
                data={paginated}
                selectedVideoId={selectedVideoId}
                onSelectVideo={(item) => setSelectedVideoId(item.video_id)}
              />
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}

          <CommentsModal
            open={!!selectedVideo}
            onClose={() => setSelectedVideoId(null)}
            url={selectedVideo?.url}
            caption={selectedVideo?.title ? decodeHtmlEntities(selectedVideo.title) : undefined}
          >
            {selectedVideo && <ViralCommentsList data={selectedVideo.comments} />}
          </CommentsModal>
        </>
      )}
    </div>
  );
});

export default YoutubeTrendingTab;
