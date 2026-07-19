"use client";

import { useEffect, useState } from "react";
import { Clock, Loader2, SearchX } from "lucide-react";

import FilterBar from "@/components/filters/FilterBar";
import ExposureSection from "@/features/dashboard/sections/ExposureSection";
import SentimentSection from "@/features/dashboard/sections/SentimentSection";
import SentimentVideoGrid from "@/components/youtube/SentimentVideoGrid";
import Pagination from "@/components/common/Pagination";
import WordCloud from "@/components/dashboard/WordCloud";
import SentimentTimeline from "@/components/dashboard/SentimentTimeline";
import SearchHistoryPanel from "@/features/history/components/SearchHistoryPanel";
import { useSearchHistory } from "@/features/history/hooks/useSearchHistory";

import { useDashboardStore } from "@/store/dashboard.store";
import { useFilterStore } from "@/stores/filterStore";
import { useAnalyze } from "@/features/analysis/hooks/useAnalyze";
import { usePagination } from "@/hooks/usePagination";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { DashboardPost } from "@/types/dashboard.type";

export default function YoutubeSentimentTab() {
  const { t } = useTranslation();
  const [historyOpen, setHistoryOpen] = useState(false);

  const dashboard = useDashboardStore((s) => s.dashboard);
  const loading = useDashboardStore((s) => s.loading);

  const keyword = useFilterStore((s) => s.keyword);
  const setKeyword = useFilterStore((s) => s.setKeyword);
  const platform = useFilterStore((s) => s.platform);

  const { history, push: pushHistory, remove: removeHistory, clear: clearHistory } = useSearchHistory();
  const { execute } = useAnalyze();
  const { page, totalPages, setPage, paginated } = usePagination<DashboardPost>(dashboard?.topPosts, 8);

  // Push to history after analysis completes
  useEffect(() => {
    if (!dashboard) return;
    pushHistory({
      keyword: dashboard.keyword ?? keyword,
      platform: dashboard.platform ?? platform,
      stats: {
        totalPosts: dashboard.summary?.totalPosts ?? 0,
        totalComments: dashboard.summary?.totalComments ?? 0,
        sentiment: {
          positive: dashboard.sentiment?.positive ?? 0,
          neutral: dashboard.sentiment?.neutral ?? 0,
          negative: dashboard.sentiment?.negative ?? 0,
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboard]);

  function handleReloadHistory(item: { keyword: string; platform: string }) {
    setKeyword(item.keyword);
    execute(item.platform, item.keyword);
  }

  return (
    <div className="space-y-6">
      <SearchHistoryPanel
        history={history}
        onRemove={removeHistory}
        onClear={clearHistory}
        onReload={handleReloadHistory}
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />

      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t.accountSentimentTab.title}</h2>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
            {t.youtubeSentimentTab.desc}
          </p>
        </div>

        <button
          onClick={() => setHistoryOpen(true)}
          className="flex h-9 shrink-0 items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 text-sm font-medium text-slate-600 dark:text-slate-400 transition hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <Clock size={14} />
          {t.header.history}
          {history.length > 0 && (
            <span className="rounded-full bg-indigo-100 px-1.5 text-[10px] font-semibold text-indigo-600">
              {history.length}
            </span>
          )}
        </button>
      </div>

      <FilterBar showSearch={false} />

      {loading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-white dark:bg-slate-900 py-24 shadow-sm">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-indigo-600" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">{t.youtubeSentimentTab.loadingTitle}</p>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
            {t.youtubeSentimentTab.loadingDesc}
          </p>
        </div>
      )}

      {!loading && !dashboard && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 py-28 text-center shadow-sm">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40">
            <SearchX className="h-8 w-8 text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">{t.youtubeSentimentTab.emptyTitle}</h2>
          <p className="mt-2 max-w-sm text-sm text-slate-400 dark:text-slate-500">
            {t.youtubeSentimentTab.emptyDescPrefix}{" "}
            <span className="font-semibold text-indigo-600">Analyze</span> {t.youtubeSentimentTab.emptyDescSuffix}
          </p>
        </div>
      )}

      {!loading && dashboard && (
        <div className="space-y-6">
          <ExposureSection data={dashboard.summary} sentiment={dashboard.sentiment} timeline={dashboard.timeline} />

          <SentimentTimeline data={dashboard.timeline} />

          <SentimentSection
            data={[
              { sentiment: "positive", total: dashboard.sentiment.positive },
              { sentiment: "neutral",  total: dashboard.sentiment.neutral  },
              { sentiment: "negative", total: dashboard.sentiment.negative },
            ]}
            platform={dashboard.platformDistribution}
          />

          <div>
            <div className="mb-4">
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t.youtubeVideoGrid.title}</h2>
              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{t.youtubeVideoGrid.subtitle}</p>
            </div>
            <SentimentVideoGrid data={paginated} />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>

          <WordCloud data={dashboard.wordCloud} />
        </div>
      )}
    </div>
  );
}
