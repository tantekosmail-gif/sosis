"use client";

import { Loader2, TrendingUp } from "lucide-react";

import NewsResultCard from "@/components/news/NewsResultCard";
import NewsSummaryWidget from "@/components/news/NewsSummaryWidget";
import { useNewsSummary } from "../hooks/useNewsSummary";
import { useNewsTrending } from "../hooks/useNewsTrending";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default function NewsTrendingTab() {
  const { data: summary, loading: summaryLoading, error: summaryError } = useNewsSummary();
  const { data: trending, loading: trendingLoading, error: trendingError } = useNewsTrending();

  return (
    <div className="space-y-6">
      {summaryLoading && (
        <div className="flex items-center justify-center rounded-2xl border bg-white py-12 shadow-sm dark:bg-slate-900">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
        </div>
      )}

      {!summaryLoading && summaryError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600 dark:bg-red-950/40">
          {summaryError}
        </div>
      )}

      {!summaryLoading && !summaryError && summary && <NewsSummaryWidget data={summary} />}

      <div>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40">
            <TrendingUp size={17} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Artikel Trending Hari Ini</h2>
            {trending && (
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {trending.total_articles} artikel • {formatDate(trending.date)}
              </p>
            )}
          </div>
        </div>

        {trendingLoading && (
          <div className="flex flex-col items-center justify-center rounded-2xl border bg-white py-24 shadow-sm dark:bg-slate-900">
            <Loader2 className="mb-4 h-10 w-10 animate-spin text-indigo-600" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">Memuat artikel trending...</p>
          </div>
        )}

        {!trendingLoading && trendingError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600 dark:bg-red-950/40">
            {trendingError}
          </div>
        )}

        {!trendingLoading && !trendingError && trending && (
          trending.items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-500">
              Belum ada artikel trending hari ini
            </div>
          ) : (
            <div className="space-y-4">
              {trending.items.map((item) => (
                <NewsResultCard key={item.post_id} item={item} sentiment={item.sentiment} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
