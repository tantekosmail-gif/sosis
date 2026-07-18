"use client";

import { useMemo, useState } from "react";
import { Loader2, Newspaper, Search } from "lucide-react";

import NewsResultCard from "@/components/news/NewsResultCard";
import NegativeHighlightCard from "@/components/news/NegativeHighlightCard";
import WordCloud from "@/components/dashboard/WordCloud";
import Pagination from "@/components/common/Pagination";
import { useNewsSearch } from "../hooks/useNewsSearch";
import { useRecentNewsSearches } from "../hooks/useRecentSearches";
import type { NewsSearchItem } from "../types/search.types";
import { usePagination } from "@/hooks/usePagination";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { buildWordCloud } from "@/lib/wordCloud";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

type SortKey = "terbaru" | "negatif";

// sentiment bisa berupa label string polos atau objek {label, score}
// tergantung sumbernya — dua helper ini menyamakan cara membacanya.
function getSentimentLabel(sentiment: NewsSearchItem["sentiment"]) {
  if (!sentiment) return null;
  return typeof sentiment === "string" ? sentiment : sentiment.label;
}

function getSentimentScore(sentiment: NewsSearchItem["sentiment"]) {
  return typeof sentiment === "object" && sentiment ? sentiment.score : 1;
}

export default function NewsSearchTab() {
  const { t, language } = useTranslation();
  const SORT_OPTIONS = [
    { key: "terbaru" as const, label: t.newsSearchTab.sortNewest },
    { key: "negatif" as const, label: t.newsSearchTab.sortMostNegative },
  ];
  const [query, setQuery] = useState("");
  const { data, loading, error, hasSearched, search } = useNewsSearch();
  const { recent, addRecentSearch } = useRecentNewsSearches();
  const [sortBy, setSortBy] = useState<SortKey>("terbaru");

  const sortedItems = useMemo(() => {
    if (!data) return [];
    const items = [...data.items];
    if (sortBy === "negatif") {
      return items.sort((a, b) => {
        const aScore = getSentimentLabel(a.sentiment) === "negatif" ? getSentimentScore(a.sentiment) : -1;
        const bScore = getSentimentLabel(b.sentiment) === "negatif" ? getSentimentScore(b.sentiment) : -1;
        return bScore - aScore;
      });
    }
    return items.sort((a, b) => (b.published_at ?? b.collected_at).localeCompare(a.published_at ?? a.collected_at));
  }, [data, sortBy]);

  const { page, totalPages, setPage, paginated } = usePagination(sortedItems, 8);

  const lastCollectedAt = useMemo(() => {
    if (!data) return undefined;
    return data.items.reduce<string | undefined>((latest, item) => {
      if (!latest || item.collected_at > latest) return item.collected_at;
      return latest;
    }, undefined);
  }, [data]);

  const contentWordCloud = useMemo(() => {
    if (!data) return [];
    return buildWordCloud(data.items.map((item) => `${item.title} ${item.content}`));
  }, [data]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await search(query);
    if (result?.query) addRecentSearch(result.query);
  }

  async function handleSelectRecent(term: string) {
    setQuery(term);
    const result = await search(term);
    if (result?.query) addRecentSearch(result.query);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.newsSearchTab.placeholder}
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-medium text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          {t.newsSearchTab.searchButton}
        </button>
      </form>

      {recent.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {t.newsSearchTab.recentSearches}
          </span>
          {recent.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => handleSelectRecent(term)}
              className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 transition hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300"
            >
              {term}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600 dark:bg-red-950/40">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-white py-24 shadow-sm dark:bg-slate-900">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-indigo-600" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">{t.newsSearchTab.loading}</p>
        </div>
      )}

      {!loading && !error && hasSearched && data && (
        <>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{data.total}</span> {t.newsSearchTab.resultsPrefix}{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">&ldquo;{data.query}&rdquo;</span>
            </p>
            {lastCollectedAt && (
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {t.newsSearchTab.updated.replace("{time}", formatRelativeTime(lastCollectedAt, language))}
              </p>
            )}
          </div>

          {data.items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-500">
              {t.newsSearchTab.noResults}
            </div>
          ) : (
            <>
              <NegativeHighlightCard items={data.items} />

              <div className="flex items-center justify-end gap-2">
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{t.newsSearchTab.sortLabel}</span>
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginated.map((item) => (
                  <NewsResultCard key={item.post_id} item={item} sentiment={item.sentiment} variant="grid" />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

              {contentWordCloud.length > 0 && <WordCloud data={contentWordCloud} />}
            </>
          )}
        </>
      )}

      {!hasSearched && !loading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-24 text-center dark:border-slate-600 dark:bg-slate-900">
          <Newspaper className="mb-4 h-10 w-10 text-slate-300" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">{t.newsSearchTab.emptyTitle}</p>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">{t.newsSearchTab.emptyDesc}</p>
        </div>
      )}
    </div>
  );
}
