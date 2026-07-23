"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { FaTiktok } from "react-icons/fa6";

import VideoSearchGrid from "@/components/tiktok/VideoSearchGrid";
import VideoFilterBar from "@/components/tiktok/VideoFilterBar";
import VideoDetailPanel from "@/components/tiktok/VideoDetailPanel";
import { useVideoMetadataSearch, PAGE_SIZE, type VideoSearchSort, type TikTokVideoMetadataItem } from "../hooks/useVideoMetadataSearch";
import { useLoadMore } from "@/hooks/useLoadMore";
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
    allItems,
    loadingAll,
    fetchAll,
    selectedVideoId,
    videoDetail,
    detailLoading,
    detailError,
    openVideoDetail,
  } = useVideoMetadataSearch();

  useImperativeHandle(ref, () => ({ search }));

  const handleAgeChange = useCallback((age: VideoAgeFilter) => {
    setFilterAge(age);
    const range = ageToDateRange(age);
    setFilterDateFrom(range.from);
    setFilterDateTo(range.to);
  }, []);

  const hasActiveFilter = Boolean(filterDateFrom || filterDateTo);

  // Backend /tiktok/metadata tidak punya filter tanggal server-side, jadi
  // begitu filter itu aktif, paginasi cuma bisa benar kalau dihitung dari
  // SEMUA hasil yang sudah difilter di client -- itu perlu allItems
  // (bulk-fetched), bukan cuma halaman server yang sedang aktif (lihat
  // komentar di useVideoMetadataSearch).
  useEffect(() => {
    if (hasActiveFilter && allItems === null && !loadingAll) void fetchAll();
  }, [hasActiveFilter, allItems, loadingAll, fetchAll]);

  const filterPredicate = useCallback(
    (item: TikTokVideoMetadataItem) => matchesDateRange(item.published_at, filterDateFrom, filterDateTo),
    [filterDateFrom, filterDateTo],
  );

  const filteredAll = useMemo(() => (allItems ? allItems.filter(filterPredicate) : null), [allItems, filterPredicate]);
  const { visible: filteredAllVisible, hasMore: filteredHasMore, loadMore: loadMoreFiltered } = useLoadMore(
    filteredAll,
    PAGE_SIZE,
  );
  const filteredCurrentPage = useMemo(() => (items ? items.filter(filterPredicate) : []), [items, filterPredicate]);

  // Mode "filter aktif" pakai hasil bulk-fetched + "load more" client; mode
  // normal "load more" langsung dari server -- lihat komentar fetchAll() di
  // atas untuk alasannya.
  const isBusy = hasActiveFilter ? loadingAll : loading;
  const displayItems = hasActiveFilter ? filteredAllVisible : filteredCurrentPage;
  const displayTotalCount = hasActiveFilter ? (filteredAll?.length ?? 0) : total;
  const displayHasMore = hasActiveFilter ? filteredHasMore : hasMore;
  const displayLoadingMore = hasActiveFilter ? false : loadingMore;
  const onLoadMore = hasActiveFilter ? loadMoreFiltered : loadMore;

  const hasResults = !isBusy && !error && (hasActiveFilter ? allItems !== null : items !== null);

  const listContainerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useInfiniteScroll(listContainerRef, onLoadMore, displayHasMore && !displayLoadingMore);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t.tiktokSearchTab.title}</h2>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600 dark:bg-red-950/40">
          {error}
        </div>
      )}

      {isBusy && (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
          <span className="text-slate-500 dark:text-slate-400">{t.tiktokSearchTab.loadingDesc}</span>
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
              {displayTotalCount > 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {t.tiktokSearchTab.resultsRangeLabel
                    .replace("{shown}", String(displayItems.length))
                    .replace("{total}", displayTotalCount.toLocaleString("id-ID"))}
                </p>
              ) : (
                <span />
              )}

              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t.tiktokSearchTab.sortLabel}
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => changeSort(e.target.value as VideoSearchSort)}
                  className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:bg-slate-900 transition"
                >
                  <option value="relevance">{t.tiktokSearchTab.sortRelevance}</option>
                  <option value="newest">{t.tiktokSearchTab.sortNewest}</option>
                  <option value="popular">{t.tiktokSearchTab.sortPopular}</option>
                </select>
              </div>
            </div>

            {displayItems.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-500">
                {t.videoFilterBar.noMatch}
              </div>
            ) : (
              <div ref={listContainerRef} className="scrollbar-thin mt-4 max-h-[70vh] overflow-y-auto pr-1">
                <VideoSearchGrid items={displayItems} onSelectVideo={openVideoDetail} selectedVideoId={selectedVideoId} />
                {displayHasMore && <div ref={sentinelRef} className="h-1" />}
                {displayHasMore && displayLoadingMore && (
                  <div className="flex items-center justify-center gap-2 py-4 text-xs text-slate-400 dark:text-slate-500">
                    <Loader2 size={14} className="animate-spin" />
                    {t.common.loading}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="scrollbar-thin rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 xl:sticky xl:top-4 xl:max-h-[calc(100vh-2rem)] xl:overflow-y-auto">
            <VideoDetailPanel detail={videoDetail} loading={detailLoading} error={detailError} />
          </div>
        </div>
      )}

      {!isBusy && !error && items === null && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center dark:border-slate-700 dark:bg-slate-900">
          <FaTiktok size={28} className="text-slate-300 dark:text-slate-600" />
          <p className="text-sm text-slate-400 dark:text-slate-500">{t.tiktokSearchTab.emptyTitle}</p>
        </div>
      )}
    </div>
  );
});

export default VideoSearchTab;
