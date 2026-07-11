"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, RefreshCw, Search } from "lucide-react";

import TikTokProfileCard from "@/components/tiktok/TikTokProfileCard";
import TikTokPostGrid from "@/components/tiktok/TikTokPostGrid";
import TikTokCommentsList from "@/components/tiktok/TikTokCommentsList";
import TikTokSummaryWidget from "@/components/tiktok/TikTokSummaryWidget";
import TikTokDiscoverPanel from "@/components/tiktok/TikTokDiscoverPanel";
import CommentsModal from "@/components/common/CommentsModal";
import { useTikTokPosts } from "../hooks/useTikTokPosts";
import { useTikTokSummary } from "../hooks/useTikTokSummary";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const MAX_POSTS_OPTIONS = [3, 5, 10];

export default function TikTokSentimentTab() {
  const { t } = useTranslation();
  const tp = t.accountSentimentTab.tiktok;
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
  } = useTikTokPosts();

  const { data: summary } = useTikTokSummary();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    search(usernameInput);
  }

  function handleSelectAccount(username: string) {
    setUsernameInput(username);
    search(username);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t.accountSentimentTab.title}</h2>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
          {tp.desc}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {summary && <TikTokSummaryWidget data={summary} onSelectAccount={handleSelectAccount} />}
        <TikTokDiscoverPanel onSelectAccount={handleSelectAccount} />
      </div>

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
                className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-rose-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition"
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
              className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 text-sm text-slate-800 dark:text-slate-200 focus:border-rose-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition"
            >
              {MAX_POSTS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt} {tp.countUnit}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading || !usernameInput.trim()}
            className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-rose-600 px-4 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50 transition"
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
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/40 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-white dark:bg-slate-900 py-24 shadow-sm">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-rose-600" />
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

          <TikTokProfileCard pageInfo={data.page_info} stats={data.stats} sentiment={data.sentiment} />

          <TikTokPostGrid
            data={data.items}
            selectedPostId={selectedPostId}
            onSelectPost={(item) => setSelectedPostId(item.post_id)}
          />

          <CommentsModal
            open={!!selectedPost}
            onClose={() => setSelectedPostId(null)}
            url={selectedPost?.url}
            caption={selectedPost?.caption}
          >
            {selectedPost && <TikTokCommentsList data={selectedPost.comments} />}
          </CommentsModal>
        </>
      )}
    </div>
  );
}
