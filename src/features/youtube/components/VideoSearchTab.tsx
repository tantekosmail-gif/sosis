"use client";

import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { FaYoutube } from "react-icons/fa6";

import VideoSearchGrid from "@/components/youtube/VideoSearchGrid";
import VideoFilterBar from "@/components/youtube/VideoFilterBar";
import Pagination from "@/components/common/Pagination";
import SentimentBreakdownBar from "@/components/common/SentimentBreakdownBar";
import { useVideoSearch } from "../hooks/useVideoSearch";
import { usePagination } from "@/hooks/usePagination";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { decodeHtmlEntities } from "@/lib/decodeHtmlEntities";
import { matchesDateRange } from "@/lib/videoDateRangeFilter";
import type { SentimentDistributionResponse } from "../services/search.service";

type SortBy = "relevance" | "newest" | "popular";

function toBreakdownSummary(distribution: SentimentDistributionResponse["distribution"]) {
  const byLabel = Object.fromEntries(distribution.map((d) => [d.label, d]));
  return {
    positif: byLabel.positif,
    netral: byLabel.netral,
    negatif: byLabel.negatif,
  };
}

export interface VideoSearchTabHandle {
  search: (keyword: string) => void;
}

const VideoSearchTab = forwardRef<VideoSearchTabHandle>(function VideoSearchTab(_props, ref) {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState<SortBy>("relevance");
  const [filterQuery, setFilterQuery] = useState("");
  const [filterChannel, setFilterChannel] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const {
    keyword,
    items,
    total,
    loading,
    error,
    search,
    hoursBack,
    changeHoursBack,
    sentimentDistribution,
  } = useVideoSearch();

  useImperativeHandle(ref, () => ({ search }));

  const sortedItems = useMemo(() => {
    if (!items) return items;
    if (sortBy === "newest") return [...items].sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    if (sortBy === "popular") return [...items].sort((a, b) => b.views - a.views);
    return items;
  }, [items, sortBy]);

  const channelOptions = useMemo(() => {
    if (!items) return [];
    return Array.from(new Set(items.map((item) => decodeHtmlEntities(item.channel).trim()).filter(Boolean))).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!sortedItems) return sortedItems;
    const q = filterQuery.trim().toLowerCase();
    return sortedItems.filter((item) => {
      if (q && !decodeHtmlEntities(item.title).toLowerCase().includes(q)) return false;
      if (filterChannel && decodeHtmlEntities(item.channel).trim() !== filterChannel) return false;
      if (!matchesDateRange(item.published_at, filterDateFrom, filterDateTo)) return false;
      return true;
    });
  }, [sortedItems, filterQuery, filterChannel, filterDateFrom, filterDateTo]);

  const { page, totalPages, setPage, paginated } = usePagination(filteredItems, 8);

  const hasResults = !loading && !error && items !== null;

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

      {loading && (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
          <span className="text-slate-500 dark:text-slate-400">{t.youtubeSearchTab.loadingDesc}</span>
        </div>
      )}

      {hasResults && sentimentDistribution && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {t.youtubeSearchTab.sentimentDistributionTitle}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {t.youtubeSearchTab.sentimentDistributionDesc
              .replace("{count}", sentimentDistribution.total_comments.toLocaleString("id-ID"))
              .replace("{keyword}", sentimentDistribution.keyword_text)}
          </p>
          <SentimentBreakdownBar summary={toBreakdownSummary(sentimentDistribution.distribution)} />
        </div>
      )}

      {hasResults && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 space-y-3">
          <VideoFilterBar
            query={filterQuery}
            onQueryChange={setFilterQuery}
            channels={channelOptions}
            channel={filterChannel}
            onChannelChange={setFilterChannel}
            dateFrom={filterDateFrom}
            onDateFromChange={setFilterDateFrom}
            dateTo={filterDateTo}
            onDateToChange={setFilterDateTo}
          />

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t.youtubeSearchTab.showingPrefix}{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">{sortedItems!.length}</span>{" "}
              {t.youtubeSearchTab.showingMiddle}{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">{total}</span>{" "}
              {t.youtubeSearchTab.showingSuffix} &ldquo;{keyword}&rdquo;
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t.youtubeSearchTab.windowLabel}
                </label>
                <select
                  value={hoursBack}
                  onChange={(e) => changeHoursBack(Number(e.target.value))}
                  className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:bg-slate-900 transition"
                >
                  <option value={24}>{t.youtubeSearchTab.window1Day}</option>
                  <option value={168}>{t.youtubeSearchTab.window1Week}</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t.youtubeSearchTab.sortLabel}
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:bg-slate-900 transition"
                >
                  <option value="relevance">{t.youtubeSearchTab.sortRelevance}</option>
                  <option value="newest">{t.youtubeSearchTab.sortNewest}</option>
                  <option value="popular">{t.youtubeSearchTab.sortPopular}</option>
                </select>
              </div>
            </div>
          </div>

          {filteredItems && filteredItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-500">
              {t.videoFilterBar.noMatch}
            </div>
          ) : (
            <div className="mt-4">
              <VideoSearchGrid items={paginated} />
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      )}

      {!loading && !error && items === null && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center dark:border-slate-700 dark:bg-slate-900">
          <FaYoutube size={28} className="text-slate-300 dark:text-slate-600" />
          <p className="text-sm text-slate-400 dark:text-slate-500">{t.youtubeSearchTab.emptyTitle}</p>
        </div>
      )}
    </div>
  );
});

export default VideoSearchTab;
