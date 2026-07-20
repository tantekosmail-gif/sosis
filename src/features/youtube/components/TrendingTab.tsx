"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";

import AnalyticsVideoGrid from "@/components/youtube/analytics/AnalyticsVideoGrid";
import AnalyticsStatCards from "@/components/youtube/analytics/AnalyticsStatCards";
import AnalyticsSentimentPanel from "@/components/youtube/analytics/AnalyticsSentimentPanel";
import ViralCommentsList from "@/components/youtube/ViralCommentsList";
import VideoFilterBar from "@/components/youtube/VideoFilterBar";
import CommentsModal from "@/components/common/CommentsModal";
import LoadMoreButton from "@/components/common/LoadMoreButton";
import { useViralVideos } from "../hooks/useViralVideos";
import { useLoadMore } from "@/hooks/useLoadMore";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { decodeHtmlEntities } from "@/lib/decodeHtmlEntities";
import { matchesAgeFilter, type VideoAgeFilter } from "@/lib/videoAgeFilter";
import { matchesDateRange } from "@/lib/videoDateRangeFilter";
import { aggregateViralStats } from "../lib/aggregateViralStats";
import { hankenGrotesk } from "@/lib/fonts/dashboardFonts";

const PAGE_SIZE = 8; // 4 kolom (xl) x 2 baris
type SortBy = "trending" | "newest" | "viral";

const SORT_OPTIONS: { key: SortBy; label: string }[] = [
  { key: "trending", label: "Trending" },
  { key: "newest", label: "Newest" },
  { key: "viral", label: "Most Viral" },
];

export interface TrendingTabHandle {
  search: (keyword: string) => void;
}

const YoutubeTrendingTab = forwardRef<TrendingTabHandle>(function YoutubeTrendingTab(_props, ref) {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState<SortBy>("trending");
  const [filterAge, setFilterAge] = useState<VideoAgeFilter>("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  const {
    data,
    loading,
    error,
    setQ,
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
    if (sortBy === "viral") {
      return items.sort((a, b) => b.view_count - a.view_count);
    }
    return items.sort((a, b) => a.rank - b.rank);
  }, [data?.items, sortBy]);

  const filteredItems = useMemo(() => {
    return sortedItems.filter((item) => {
      if (!matchesAgeFilter(item.published_at, filterAge)) return false;
      if (!matchesDateRange(item.published_at, filterDateFrom, filterDateTo)) return false;
      return true;
    });
  }, [sortedItems, filterAge, filterDateFrom, filterDateTo]);

  const { visible: paginated, hasMore, loadMore } = useLoadMore(filteredItems, PAGE_SIZE);

  const { stats: filteredStats, sentiment: filteredSentiment } = useMemo(
    () => aggregateViralStats(filteredItems),
    [filteredItems]
  );

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <VideoFilterBar
            age={filterAge}
            onAgeChange={setFilterAge}
            dateFrom={filterDateFrom}
            onDateFromChange={setFilterDateFrom}
            dateTo={filterDateTo}
            onDateToChange={setFilterDateTo}
          />

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
          <AnalyticsStatCards stats={filteredStats} />
          <AnalyticsSentimentPanel sentiment={filteredSentiment} />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className={`${hankenGrotesk.className} text-lg font-bold text-slate-900 dark:text-slate-100`}>
              Viral Video Performance
            </h3>
            <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setSortBy(opt.key)}
                  className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
                    sortBy === opt.key
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-500">
              {t.videoFilterBar.noMatch}
            </div>
          ) : (
            <>
              <AnalyticsVideoGrid
                data={paginated}
                selectedVideoId={selectedVideoId}
                onSelectVideo={(item) => setSelectedVideoId(item.video_id)}
              />
              {hasMore && <LoadMoreButton onClick={loadMore} />}
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
