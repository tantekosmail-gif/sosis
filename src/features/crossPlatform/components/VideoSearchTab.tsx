"use client";

import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Combine, Loader2 } from "lucide-react";

import VideoSearchGrid from "@/components/crossPlatform/VideoSearchGrid";
import VideoFilterBar from "@/components/crossPlatform/VideoFilterBar";
import VideoDetailPanel from "@/components/crossPlatform/VideoDetailPanel";
import { useCrossPlatformVideoSearch, type VideoSearchSort } from "../hooks/useCrossPlatformVideoSearch";
import { useFavoriteVideos } from "../hooks/useFavoriteVideos";
import type { CrossPlatformVideoItem } from "../services/videoSearch.service";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { matchesDateRange } from "@/lib/videoDateRangeFilter";
import type { VideoAgeFilter } from "@/lib/videoAgeFilter";

export interface VideoSearchTabHandle {
  search: (keyword: string) => void;
}

function toDateInputValue(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// Preset "Hari Ini"/"Minggu Ini"/"Bulan Ini" cuma jalan pintas buat ngisi
// rentang tanggal -- matchesDateRange tetap satu-satunya sumber kebenaran
// filter tanggal, jadi field dari/sampai selalu mencerminkan preset yang
// aktif dan tetap bisa diedit manual sesudahnya.
function ageToDateRange(age: VideoAgeFilter): { from: string; to: string } {
  if (age === "all") return { from: "", to: "" };
  const to = new Date();
  const from = new Date();
  if (age === "week") from.setDate(from.getDate() - 7);
  else if (age === "month") from.setDate(from.getDate() - 30);
  return { from: toDateInputValue(from), to: toDateInputValue(to) };
}

const VideoSearchTab = forwardRef<VideoSearchTabHandle>(function VideoSearchTab(_props, ref) {
  const { t } = useTranslation();
  const [filterAge, setFilterAge] = useState<VideoAgeFilter>("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const {
    items,
    total,
    loading,
    loadingMore,
    error,
    search,
    sortBy,
    changeSort,
    loadMore,
    hasMore,
    selectedVideoId,
    videoDetail,
    detailLoading,
    detailError,
    openVideoDetail,
  } = useCrossPlatformVideoSearch();
  const { isFavorite, toggleFavorite } = useFavoriteVideos();

  useImperativeHandle(ref, () => ({ search }));

  const handleAgeChange = useCallback((age: VideoAgeFilter) => {
    setFilterAge(age);
    const range = ageToDateRange(age);
    setFilterDateFrom(range.from);
    setFilterDateTo(range.to);
  }, []);

  // Filter tanggal cuma menyaring item yang SUDAH dimuat (dari kedua
  // platform) -- beda dari tab per-platform, di sini tidak ada mode
  // "bulk-fetch semua hasil" terpisah supaya kompleksitas gabungan dua sumber
  // tetap terkendali. "Load more" tetap menambah data mentah dari server;
  // filter cuma menentukan mana yang ditampilkan dari yang sudah ada.
  const filteredItems = useMemo(() => {
    if (!items) return items;
    return items.filter((item: CrossPlatformVideoItem) => matchesDateRange(item.published_at, filterDateFrom, filterDateTo));
  }, [items, filterDateFrom, filterDateTo]);

  const hasResults = !loading && !error && items !== null;

  const listContainerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useInfiniteScroll(listContainerRef, loadMore, hasMore && !loadingMore);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t.crossPlatformSearchTab.title}</h2>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600 dark:bg-red-950/40">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
          <span className="text-slate-500 dark:text-slate-400">{t.crossPlatformSearchTab.loadingDesc}</span>
        </div>
      )}

      {hasResults && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[380px_minmax(0,1fr)] xl:items-start">
          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 space-y-3">
            <VideoFilterBar
              age={filterAge}
              onAgeChange={handleAgeChange}
              dateFrom={filterDateFrom}
              onDateFromChange={setFilterDateFrom}
              dateTo={filterDateTo}
              onDateToChange={setFilterDateTo}
            />

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
              {total > 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {t.crossPlatformSearchTab.resultsRangeLabel
                    .replace("{shown}", String(filteredItems?.length ?? 0))
                    .replace("{total}", total.toLocaleString("id-ID"))}
                </p>
              ) : (
                <span />
              )}

              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t.crossPlatformSearchTab.sortLabel}
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => changeSort(e.target.value as VideoSearchSort)}
                  className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:bg-slate-900 transition"
                >
                  <option value="relevance">{t.crossPlatformSearchTab.sortRelevance}</option>
                  <option value="newest">{t.crossPlatformSearchTab.sortNewest}</option>
                  <option value="popular">{t.crossPlatformSearchTab.sortPopular}</option>
                </select>
              </div>
            </div>

            {!filteredItems || filteredItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-500">
                {t.videoFilterBar.noMatch}
              </div>
            ) : (
              <div ref={listContainerRef} className="scrollbar-thin mt-4 max-h-[70vh] overflow-y-auto pr-1">
                <VideoSearchGrid
                  items={filteredItems}
                  onSelectVideo={openVideoDetail}
                  selectedVideoId={selectedVideoId}
                  isFavorite={(item) => isFavorite(item.platform, item.id)}
                  onToggleFavorite={toggleFavorite}
                />
                {hasMore && <div ref={sentinelRef} className="h-1" />}
                {hasMore && loadingMore && (
                  <div className="flex items-center justify-center gap-2 py-4 text-xs text-slate-400 dark:text-slate-500">
                    <Loader2 size={14} className="animate-spin" />
                    {t.common.loading}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="scrollbar-thin rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 xl:sticky xl:top-4 xl:max-h-[calc(100vh-2rem)] xl:overflow-y-auto">
            <VideoDetailPanel
              detail={videoDetail}
              loading={detailLoading}
              error={detailError}
              isFavorite={videoDetail ? isFavorite(videoDetail.platform, videoDetail.id) : false}
              onToggleFavorite={videoDetail ? () => toggleFavorite(videoDetail) : undefined}
            />
          </div>
        </div>
      )}

      {!loading && !error && items === null && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center dark:border-slate-700 dark:bg-slate-900">
          <Combine size={28} className="text-slate-300 dark:text-slate-600" />
          <p className="text-sm text-slate-400 dark:text-slate-500">{t.crossPlatformSearchTab.emptyTitle}</p>
        </div>
      )}
    </div>
  );
});

export default VideoSearchTab;
