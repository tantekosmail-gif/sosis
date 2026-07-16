"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { Loader2 } from "lucide-react";
import { FaYoutube } from "react-icons/fa6";

import VideoSearchGrid from "@/components/youtube/VideoSearchGrid";
import { useVideoSearch } from "../hooks/useVideoSearch";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

type SortBy = "relevance" | "newest" | "popular";

export interface VideoSearchTabHandle {
  search: (keyword: string) => void;
}

const VideoSearchTab = forwardRef<VideoSearchTabHandle>(function VideoSearchTab(_props, ref) {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState<SortBy>("relevance");
  const { keyword, items, total, loading, error, search } = useVideoSearch();

  useImperativeHandle(ref, () => ({ search }));

  const sortedItems = !items
    ? items
    : sortBy === "newest"
      ? [...items].sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      : sortBy === "popular"
        ? [...items].sort((a, b) => b.views - a.views)
        : items;

  const hasResults = !loading && !error && items !== null;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t.youtubeSearchTab.title}</h2>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">{t.youtubeSearchTab.subtitle}</p>
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

      {hasResults && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t.youtubeSearchTab.showingPrefix}{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">{sortedItems!.length}</span>{" "}
              {t.youtubeSearchTab.showingMiddle}{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">{total}</span>{" "}
              {t.youtubeSearchTab.showingSuffix} &ldquo;{keyword}&rdquo;
            </p>

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
          <div className="mt-4">
            <VideoSearchGrid items={sortedItems!} />
          </div>
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
