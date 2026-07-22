"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { FaYoutube } from "react-icons/fa6";

import VideoSearchGrid from "@/components/youtube/VideoSearchGrid";
import VideoFilterBar from "@/components/youtube/VideoFilterBar";
import VideoDetailModal from "@/components/youtube/VideoDetailModal";
import Pagination from "@/components/common/Pagination";
import { useVideoSearch, PAGE_SIZE, type VideoSearchSort, type VideoMetadataItem } from "../hooks/useVideoSearch";
import { usePagination } from "@/hooks/usePagination";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { decodeHtmlEntities } from "@/lib/decodeHtmlEntities";
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
  const [filterChannel, setFilterChannel] = useState("");
  const [filterTopic, setFilterTopic] = useState("");
  const [filterAge, setFilterAge] = useState<VideoAgeFilter>("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const {
    items,
    total,
    page,
    totalPages,
    loading,
    error,
    search,
    sortBy,
    changeSort,
    goToPage,
    allItems,
    loadingAll,
    fetchAll,
    selectedVideoId,
    videoDetail,
    detailLoading,
    detailError,
    openVideoDetail,
    closeVideoDetail,
  } = useVideoSearch();

  useImperativeHandle(ref, () => ({ search }));

  const handleAgeChange = useCallback((age: VideoAgeFilter) => {
    setFilterAge(age);
    const range = ageToDateRange(age);
    setFilterDateFrom(range.from);
    setFilterDateTo(range.to);
  }, []);

  const hasActiveFilter = Boolean(filterChannel || filterTopic || filterDateFrom || filterDateTo);

  // Backend /youtube/metadata tidak punya filter channel/topik/tanggal
  // server-side, jadi begitu salah satu filter itu aktif, paginasi cuma bisa
  // benar kalau dihitung dari SEMUA hasil yang sudah difilter di client --
  // itu perlu allItems (bulk-fetched), bukan cuma halaman server yang sedang
  // aktif (lihat komentar di useVideoSearch).
  useEffect(() => {
    if (hasActiveFilter && allItems === null && !loadingAll) void fetchAll();
  }, [hasActiveFilter, allItems, loadingAll, fetchAll]);

  const filterPredicate = useCallback(
    (item: VideoMetadataItem) => {
      if (filterChannel && decodeHtmlEntities(item.author).trim() !== filterChannel) return false;
      if (filterTopic && item.source_topic !== filterTopic) return false;
      if (!matchesDateRange(item.published_at, filterDateFrom, filterDateTo)) return false;
      return true;
    },
    [filterChannel, filterTopic, filterDateFrom, filterDateTo],
  );

  const optionSource = allItems ?? items;

  const channelOptions = useMemo(() => {
    if (!optionSource) return [];
    return Array.from(new Set(optionSource.map((item) => decodeHtmlEntities(item.author).trim()).filter(Boolean))).sort();
  }, [optionSource]);

  const topicOptions = useMemo(() => {
    if (!optionSource) return [];
    return Array.from(new Set(optionSource.map((item) => item.source_topic).filter(Boolean))).sort();
  }, [optionSource]);

  const filteredAll = useMemo(() => (allItems ? allItems.filter(filterPredicate) : null), [allItems, filterPredicate]);
  const { paginated: filteredAllPage, page: clientPage, totalPages: clientTotalPages, setPage: setClientPage } = usePagination(
    filteredAll,
    PAGE_SIZE,
  );
  const filteredCurrentPage = useMemo(() => (items ? items.filter(filterPredicate) : []), [items, filterPredicate]);

  // Mode "filter aktif" pakai hasil bulk-fetched + paginasi client; mode
  // normal pakai satu halaman dari server + paginasi server -- lihat komentar
  // fetchAll() di atas untuk alasannya.
  const isBusy = hasActiveFilter ? loadingAll : loading;
  const displayItems = hasActiveFilter ? filteredAllPage : filteredCurrentPage;
  const displayPage = hasActiveFilter ? clientPage : page;
  const displayTotalPages = hasActiveFilter ? clientTotalPages : totalPages;
  const displayTotalCount = hasActiveFilter ? (filteredAll?.length ?? 0) : total;
  const onDisplayPageChange = hasActiveFilter ? setClientPage : goToPage;

  const rangeStart = displayTotalCount === 0 ? 0 : (displayPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(displayPage * PAGE_SIZE, displayTotalCount);

  const hasResults = !isBusy && !error && (hasActiveFilter ? allItems !== null : items !== null);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t.youtubeSearchTab.title}</h2>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600 dark:bg-red-950/40">
          {error}
        </div>
      )}

      {isBusy && (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
          <span className="text-slate-500 dark:text-slate-400">{t.youtubeSearchTab.loadingDesc}</span>
        </div>
      )}

      {hasResults && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 space-y-3">
          <VideoFilterBar
            channels={channelOptions}
            channel={filterChannel}
            onChannelChange={setFilterChannel}
            topics={topicOptions}
            topic={filterTopic}
            onTopicChange={setFilterTopic}
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
                {t.youtubeSearchTab.resultsRangeLabel
                  .replace("{start}", String(rangeStart))
                  .replace("{end}", String(rangeEnd))
                  .replace("{total}", displayTotalCount.toLocaleString("id-ID"))}
              </p>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {t.youtubeSearchTab.sortLabel}
              </label>
              <select
                value={sortBy}
                onChange={(e) => changeSort(e.target.value as VideoSearchSort)}
                className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:bg-slate-900 transition"
              >
                <option value="relevance">{t.youtubeSearchTab.sortRelevance}</option>
                <option value="newest">{t.youtubeSearchTab.sortNewest}</option>
                <option value="popular">{t.youtubeSearchTab.sortPopular}</option>
              </select>
            </div>
          </div>

          {displayItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-500">
              {t.videoFilterBar.noMatch}
            </div>
          ) : (
            <div className="mt-4">
              <VideoSearchGrid items={displayItems} onSelectVideo={openVideoDetail} />
            </div>
          )}
          <Pagination page={displayPage} totalPages={displayTotalPages} onPageChange={onDisplayPageChange} />
        </div>
      )}

      <VideoDetailModal
        open={selectedVideoId !== null}
        onClose={closeVideoDetail}
        detail={videoDetail}
        loading={detailLoading}
        error={detailError}
      />

      {!isBusy && !error && items === null && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center dark:border-slate-700 dark:bg-slate-900">
          <FaYoutube size={28} className="text-slate-300 dark:text-slate-600" />
          <p className="text-sm text-slate-400 dark:text-slate-500">{t.youtubeSearchTab.emptyTitle}</p>
        </div>
      )}
    </div>
  );
});

export default VideoSearchTab;
