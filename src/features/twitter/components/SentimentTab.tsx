"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Info, Loader2, RefreshCw, Search } from "lucide-react";

import TwitterProfileCard from "@/components/twitter/TwitterProfileCard";
import TwitterPostGrid from "@/components/twitter/TwitterPostGrid";
import NegativeHighlightCard from "@/components/twitter/NegativeHighlightCard";
import TopHashtags from "@/components/twitter/TopHashtags";
import TwitterCommentsList from "@/components/twitter/TwitterCommentsList";
import TwitterSummaryWidget from "@/components/twitter/TwitterSummaryWidget";
import TwitterDiscoverPanel from "@/components/twitter/TwitterDiscoverPanel";
import CommentsModal from "@/components/common/CommentsModal";
import WordCloud from "@/components/dashboard/WordCloud";
import Pagination from "@/components/common/Pagination";
import { useTwitterPosts } from "../hooks/useTwitterPosts";
import { useTwitterSummary } from "../hooks/useTwitterSummary";
import { useRecentTwitterSearches } from "../hooks/useRecentSearches";
import { usePagination } from "@/hooks/usePagination";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { buildWordCloud } from "@/lib/wordCloud";

const MAX_POSTS_OPTIONS = [3, 5, 10];

const SORT_OPTIONS = [
  { key: "terbaru", label: "Terbaru" },
  { key: "negatif", label: "Paling Negatif" },
  { key: "komentar", label: "Paling Banyak Balasan" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["key"];

const SHOW_DISCOVER_PANEL = false;

export default function TwitterSentimentTab() {
  const { t } = useTranslation();
  const tp = t.accountSentimentTab.twitter;
  const [usernameInput, setUsernameInput] = useState("");

  const {
    data,
    loading,
    error,
    maxPosts,
    setMaxPosts,
    search,
    selectedPostId,
    setSelectedPostId,
    selectedPost,
  } = useTwitterPosts();

  const { data: summary } = useTwitterSummary();
  const { recent, addRecentSearch } = useRecentTwitterSearches();
  const [sortBy, setSortBy] = useState<SortKey>("terbaru");

  const sortedItems = useMemo(() => {
    if (!data) return [];
    const items = [...data.items];
    if (sortBy === "negatif") {
      return items.sort((a, b) => b.sentiment_summary.negatif.percentage - a.sentiment_summary.negatif.percentage);
    }
    if (sortBy === "komentar") {
      return items.sort((a, b) => b.comment_count - a.comment_count);
    }
    return items.sort((a, b) => (b.published_at || "").localeCompare(a.published_at || ""));
  }, [data, sortBy]);

  const { page, totalPages, setPage, paginated } = usePagination(sortedItems, 4);

  const commentsWordCloud = useMemo(() => {
    if (!data) return [];
    return buildWordCloud(data.items.flatMap((item) => item.comments.map((c) => c.content)));
  }, [data]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const result = await search(usernameInput);
    if (result?.username) addRecentSearch(result.username);
  }

  async function handleSelectAccount(username: string) {
    setUsernameInput(username);
    const result = await search(username);
    if (result?.username) addRecentSearch(result.username);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t.accountSentimentTab.title}</h2>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
            {tp.desc}
          </p>
        </div>
        {SHOW_DISCOVER_PANEL && <TwitterDiscoverPanel onSelectAccount={handleSelectAccount} />}
      </div>

      {summary && <TwitterSummaryWidget data={summary} onSelectAccount={handleSelectAccount} />}

      {/* Search bar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <form onSubmit={handleSearch} className="flex-1">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {tp.usernameLabel}
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                placeholder="mis. jokowi"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-sky-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition"
              />
            </div>
          </form>

          <div className="shrink-0">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {tp.countLabel}
            </label>
            <select
              value={maxPosts}
              onChange={(e) => setMaxPosts(Number(e.target.value))}
              className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 text-sm text-slate-800 dark:text-slate-200 focus:border-sky-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition"
            >
              {MAX_POSTS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt} {tp.countUnit}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading || !usernameInput.trim()}
            className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-sky-600 px-4 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50 transition"
          >
            <Search size={15} />
            {t.accountSentimentTab.analyzeButton}
          </button>

          {data && (
            <button
              onClick={() => search(data.username, true)}
              disabled={loading}
              title={tp.refreshTitle}
              className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              {t.accountSentimentTab.refreshButton}
            </button>
          )}
        </div>

        {recent.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Pencarian Terakhir
            </span>
            {recent.map((username) => (
              <button
                key={username}
                type="button"
                onClick={() => handleSelectAccount(username)}
                className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 transition hover:bg-sky-50 hover:text-sky-700 dark:hover:bg-sky-950/40 dark:hover:text-sky-300"
              >
                @{username}
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/40 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-white dark:bg-slate-900 py-24 shadow-sm">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-sky-600" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">{tp.loadingTitle}</p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{t.accountSentimentTab.loadingDesc}</p>
        </div>
      )}

      {!loading && !error && !data && (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 py-16 text-center text-sm text-slate-400 dark:text-slate-500">
          {tp.emptyState}
        </div>
      )}

      {!loading && !error && data && (
        <>
          {(data.scrape?.errors?.length ?? 0) > 0 && (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-950/40 px-5 py-4 text-sm text-amber-800">
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">{tp.scrapeErrorTitle}</p>
                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-amber-700">
                  {data.scrape?.errors?.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-amber-700">
                  {t.accountSentimentTab.scrapeErrorDesc}
                </p>
              </div>
            </div>
          )}

          {data.scrape?.skipped_reason && (
            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
              <Info size={18} className="mt-0.5 shrink-0 text-slate-400" />
              <div>
                <p className="font-semibold">Data tidak diperbarui</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{data.scrape.skipped_reason}</p>
              </div>
            </div>
          )}

          <TwitterProfileCard pageInfo={data.page_info} stats={data.stats} sentiment={data.sentiment} items={data.items} />

          <NegativeHighlightCard items={data.items} onSelect={(item) => setSelectedPostId(item.post_id)} />

          <div className="flex items-center justify-end gap-2">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Urutkan:</span>
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

          <TwitterPostGrid
            data={paginated}
            selectedPostId={selectedPostId}
            onSelectPost={(item) => setSelectedPostId(item.post_id)}
          />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

          <TopHashtags items={data.items} />

          {commentsWordCloud.length > 0 && <WordCloud data={commentsWordCloud} />}

          <CommentsModal
            open={!!selectedPost}
            onClose={() => setSelectedPostId(null)}
            title={tp.repliesModalTitle}
            url={selectedPost?.url}
            caption={selectedPost?.caption}
          >
            {selectedPost && <TwitterCommentsList data={selectedPost.comments} />}
          </CommentsModal>
        </>
      )}
    </div>
  );
}
