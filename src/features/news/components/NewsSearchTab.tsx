"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { forwardRef, useImperativeHandle } from "react";
import { Loader2, Search, ExternalLink, Flame, ThumbsUp, MessageCircle, Eye } from "lucide-react";
import { toast } from "sonner";

import { useTopics } from "@/features/topic/hooks/useTopics";
import { useTrendRecommendations } from "@/features/keywordRecommendations/hooks/useTrendRecommendations";
import { useRecentNewsSearches } from "@/features/news/hooks/useRecentSearches";
import { useNewsMetadataSearch, type NewsMetadataSort } from "@/features/news/hooks/useNewsMetadataSearch";
import NewsDetailPanel from "@/components/news/NewsDetailPanel";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { NewsMetadataItem } from "@/features/news/services/metadata.service";

const SORT_OPTIONS: { key: NewsMetadataSort; label: string }[] = [
  { key: "relevance", label: "Most Relevant" },
  { key: "newest", label: "Newest" },
  { key: "popular", label: "Most Popular" },
];

export interface NewsSearchTabHandle {
  search: (keyword: string) => void;
  searchKeywords: (keywords: string[]) => void;
}

const NewsSearchTab = forwardRef<NewsSearchTabHandle>(function NewsSearchTab(_props, ref) {
  const { t, language } = useTranslation();
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [sortBy, setSortBy] = useState<NewsMetadataSort>("newest");

  const {
    items,
    total,
    loading,
    loadingMore,
    error,
    search,
    searchKeywords,
    changeSort,
    loadMore,
    hasMore,
    selectedPostId,
    postDetail,
    detailLoading,
    detailError,
    openPostDetail,
    closePostDetail,
  } = useNewsMetadataSearch();

  const { topics } = useTopics();
  const { items: keywordRecommendations } = useTrendRecommendations();
  const { recent, addRecentSearch } = useRecentNewsSearches();

  const suggestionPool = useMemo(() => {
    const seen = new Set(recent.map((kw) => kw.toLowerCase()));
    const topicOnly = Array.from(new Set(topics.flatMap((topic) => topic.keywords)))
      .filter((kw) => !seen.has(kw.toLowerCase()))
      .sort((a, b) => a.localeCompare(b));
    topicOnly.forEach((kw) => seen.add(kw.toLowerCase()));

    const recommendationOnly = Array.from(new Set((keywordRecommendations ?? []).map((r) => r.topic))).filter(
      (kw) => !seen.has(kw.toLowerCase()),
    );

    return [
      ...recent.map((keyword) => ({ keyword, source: "recent" as const })),
      ...topicOnly.map((keyword) => ({ keyword, source: "topic" as const })),
      ...recommendationOnly.map((keyword) => ({ keyword, source: "recommendation" as const })),
    ];
  }, [recent, topics, keywordRecommendations]);

  const filteredSuggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = q ? suggestionPool.filter((s) => s.keyword.toLowerCase().includes(q)) : suggestionPool;
    return pool.slice(0, 8);
  }, [query, suggestionPool]);

  function runSearch(value: string) {
    const trimmed = value.trim();
    if (!trimmed) {
      toast.error("Masukkan keyword");
      return;
    }
    addRecentSearch(trimmed);
    search(trimmed);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    runSearch(query);
  }

  function selectSuggestion(keyword: string) {
    setQuery(keyword);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    runSearch(keyword);
  }

  useEffect(() => {
    if (!selectedPostId) return;
    openPostDetail(selectedPostId);
  }, [selectedPostId, openPostDetail]);

  useImperativeHandle(ref, () => ({
    search: (keyword: string) => runSearch(keyword),
    searchKeywords: (keywords: string[]) => searchKeywords(keywords),
  }));

  const listContainerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useInfiniteScroll(listContainerRef, loadMore, hasMore && !loadingMore);

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t.newsSearchTab.title}</h2>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600 dark:bg-red-950/40">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
          <span className="text-slate-500 dark:text-slate-400">{t.newsSearchTab.loadingDesc}</span>
        </div>
      )}

      {!loading && items !== null && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[380px_minmax(0,1fr)] xl:items-start">
          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t.newsSearchTab.sortLabel}
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => changeSort(e.target.value as NewsMetadataSort)}
                  className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:bg-slate-900 transition"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.key} value={opt.key}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {total > 0 && (
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Showing {items.length} of {total.toLocaleString("id-ID")} results
                </p>
              )}
            </div>

            {items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-500">
                {t.newsSearchTab.noResults}
              </div>
            ) : (
              <div ref={listContainerRef} className="scrollbar-thin mt-4 max-h-[70vh] overflow-y-auto pr-1">
                {items.map((item) => (
                  <NewsMetadataRow
                    key={item.id}
                    item={item}
                    isSelected={item.id === selectedPostId}
                    onSelect={() => openPostDetail(item.id)}
                  />
                ))}
                <div ref={sentinelRef} className="h-1" />
                {hasMore && loadingMore && (
                  <div className="flex items-center justify-center gap-2 py-4 text-xs text-slate-400 dark:text-slate-500">
                    <Loader2 size={14} className="animate-spin" />
                    {t.common.loading}
                  </div>
                )}
              </div>
            )}
          </div>

          <NewsDetailPanel detail={postDetail} loading={detailLoading} error={detailError} />
        </div>
      )}

      {!loading && items === null && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center dark:border-slate-700 dark:bg-slate-900">
          <Search size={28} className="text-slate-300 dark:text-slate-600" />
          <p className="text-sm text-slate-400 dark:text-slate-500">{t.newsSearchTab.emptyTitle}</p>
        </div>
      )}
    </div>
  );
});

function formatCompact(n: number) {
  if (!n) return "0";
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

function formatRelativeTime(dateStr?: string | null) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return null;
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60_000);
  if (diffMinutes < 1) return "Baru saja";
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} jam lalu`;
  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `${diffDays} hari lalu`;
  const diffWeeks = Math.round(diffDays / 7);
  return `${diffWeeks} minggu lalu`;
}

function NewsMetadataRow({
  item,
  isSelected,
  onSelect,
}: {
  item: NewsMetadataItem;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const trendScore = item.scores.trend_score ?? 0;

  return (
    <div
      className={`group flex items-start justify-between gap-2 rounded-lg px-2.5 py-2 transition-colors ${
        isSelected ? "bg-indigo-50 dark:bg-indigo-950/30" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
      }`}
    >
      <button type="button" onClick={onSelect} className="min-w-0 flex-1 text-left">
        {trendScore > 0 && (
          <span className="mb-1 inline-flex w-fit items-center gap-1 rounded-full bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
            <Flame size={10} /> {trendScore.toFixed(1)}
          </span>
        )}
        <h3
          className={`line-clamp-1 min-w-0 break-words text-sm font-semibold leading-snug transition-colors ${
            isSelected ? "text-indigo-700 dark:text-indigo-400" : "text-slate-800 group-hover:text-indigo-600 dark:text-slate-200"
          }`}
        >
          {item.title || "(no title)"}
        </h3>
        <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{item.author || "Unknown"}</p>

        <div>
          {item.metrics && (
            <div className="mt-1 flex items-center gap-2.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              {(item.metrics.views ?? 0) > 0 && (
                <span className="flex items-center gap-1">
                  <Eye size={11} className="text-slate-400 dark:text-slate-500" />
                  {formatCompact(item.metrics.views)}
                </span>
              )}
              <span className="flex items-center gap-1">
                <ThumbsUp size={11} className="text-slate-400 dark:text-slate-500" />
                {formatCompact(item.metrics.likes ?? 0)}
              </span>
              {(item.saved_comments_count ?? 0) > 0 && (
                <span className="flex items-center gap-1">
                  <MessageCircle size={11} className="text-slate-400 dark:text-slate-500" />
                  {formatCompact(item.saved_comments_count ?? 0)}
                </span>
              )}
            </div>
          )}
          <span className="font-normal text-slate-400 dark:text-slate-500">
            {formatRelativeTime(item.published_at ?? item.collected_at) ?? ""}
          </span>
        </div>
      </button>

      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        title="Open article"
        className="shrink-0 rounded-lg p-1 text-slate-300 transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-600 dark:hover:bg-slate-800"
      >
        <ExternalLink size={13} />
      </a>
    </div>
  );
}

NewsSearchTab.displayName = "NewsSearchTab";

export default NewsSearchTab;
