"use client";

import { useMemo, useState } from "react";
import { Loader2, TrendingUp } from "lucide-react";

import NewsResultCard from "@/components/news/NewsResultCard";
import NewsSummaryWidget from "@/components/news/NewsSummaryWidget";
import NegativeHighlightCard from "@/components/news/NegativeHighlightCard";
import { useNewsSummary } from "../hooks/useNewsSummary";
import { useNewsTrending } from "../hooks/useNewsTrending";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

type SortKey = "terbaru" | "positif" | "negatif";

type SentimentKey = "positif" | "netral" | "negatif";
type SentimentFilter = "all" | SentimentKey;

function formatDate(value: string, language: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(language === "id" ? "id-ID" : "en-US", { day: "numeric", month: "long", year: "numeric" });
}

export default function NewsTrendingTab() {
  const { t, language } = useTranslation();
  const SORT_OPTIONS = [
    { key: "terbaru" as const, label: t.newsTrendingTab.sortNewest },
    { key: "positif" as const, label: t.newsTrendingTab.sortMostPositive },
    { key: "negatif" as const, label: t.newsTrendingTab.sortMostNegative },
  ];
  const SENTIMENT_FILTER_META: Record<SentimentKey, { label: string; dot: string; activeBg: string; activeText: string }> = {
    positif: { label: t.sentimentPie.positive, dot: "bg-emerald-500", activeBg: "bg-emerald-50 dark:bg-emerald-950/40", activeText: "text-emerald-700" },
    netral: { label: t.sentimentPie.neutral, dot: "bg-amber-400", activeBg: "bg-amber-50 dark:bg-amber-950/40", activeText: "text-amber-700" },
    negatif: { label: t.sentimentPie.negative, dot: "bg-red-500", activeBg: "bg-red-50 dark:bg-red-950/40", activeText: "text-red-700" },
  };
  const { data: summary, loading: summaryLoading, error: summaryError } = useNewsSummary();
  const { data: trending, loading: trendingLoading, error: trendingError } = useNewsTrending();
  const [sortBy, setSortBy] = useState<SortKey>("terbaru");
  const [sentimentFilter, setSentimentFilter] = useState<SentimentFilter>("all");

  const sortedItems = useMemo(() => {
    if (!trending) return [];
    const items = [...trending.items];
    if (sortBy === "negatif") {
      return items.sort((a, b) => {
        const aScore = a.sentiment?.label === "negatif" ? a.sentiment.score : -1;
        const bScore = b.sentiment?.label === "negatif" ? b.sentiment.score : -1;
        return bScore - aScore;
      });
    }
    if (sortBy === "positif") {
      return items.sort((a, b) => {
        const aScore = a.sentiment?.label === "positif" ? a.sentiment.score : -1;
        const bScore = b.sentiment?.label === "positif" ? b.sentiment.score : -1;
        return bScore - aScore;
      });
    }
    return items.sort((a, b) => (b.published_at ?? b.collected_at).localeCompare(a.published_at ?? a.collected_at));
  }, [trending, sortBy]);

  // Dihitung dari item trending hari ini saja (bukan korpus keseluruhan di
  // NewsSummaryWidget) — sekaligus jadi label chip filter, biar tidak ada dua
  // baris ringkasan sentimen yang tumpang tindih secara visual.
  const sentimentCounts = useMemo(() => {
    const counts: Record<SentimentKey, number> = { positif: 0, netral: 0, negatif: 0 };
    trending?.items.forEach((item) => {
      const label = item.sentiment?.label;
      if (label === "positif" || label === "netral" || label === "negatif") counts[label]++;
    });
    return counts;
  }, [trending]);

  const filteredItems = useMemo(() => {
    if (sentimentFilter === "all") return sortedItems;
    return sortedItems.filter((item) => item.sentiment?.label === sentimentFilter);
  }, [sortedItems, sentimentFilter]);

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
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t.newsTrendingTab.title}</h2>
            {trending && (
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {t.newsTrendingTab.subtitle
                  .replace("{count}", String(trending.total_articles))
                  .replace("{date}", formatDate(trending.date, language))}
              </p>
            )}
          </div>
        </div>

        {trendingLoading && (
          <div className="flex flex-col items-center justify-center rounded-2xl border bg-white py-24 shadow-sm dark:bg-slate-900">
            <Loader2 className="mb-4 h-10 w-10 animate-spin text-indigo-600" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">{t.newsTrendingTab.loading}</p>
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
              {t.newsTrendingTab.empty}
            </div>
          ) : (
            <div className="space-y-4">
              <NegativeHighlightCard items={trending.items} />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSentimentFilter("all")}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      sentimentFilter === "all"
                        ? "bg-indigo-600 text-white"
                        : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                    }`}
                  >
                    {t.newsTrendingTab.filterAll} ({trending.items.length})
                  </button>
                  {(["positif", "netral", "negatif"] as const).map((key) => {
                    const meta = SENTIMENT_FILTER_META[key];
                    const active = sentimentFilter === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSentimentFilter(active ? "all" : key)}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                          active
                            ? `${meta.activeBg} ${meta.activeText} ring-1 ring-inset ring-current/30`
                            : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                        {meta.label} ({sentimentCounts[key]})
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{t.newsTrendingTab.sortLabel}</span>
                  <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setSortBy(opt.key)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                          sortBy === opt.key ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {filteredItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-sm text-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-500">
                  {t.newsTrendingTab.noSentimentMatch}
                </div>
              ) : (
                filteredItems.map((item, idx) => (
                  <NewsResultCard key={item.post_id} item={item} sentiment={item.sentiment} rank={idx + 1} dateMode="relative" />
                ))
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
