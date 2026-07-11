"use client";

import { Loader2, RefreshCw } from "lucide-react";

import TrendingTopicCard from "@/components/twitter/TrendingTopicCard";
import TwitterCommentsList from "@/components/twitter/TwitterCommentsList";
import CommentsModal from "@/components/common/CommentsModal";
import { useTwitterTrending } from "../hooks/useTwitterTrending";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function TwitterTrendingTab() {
  const { t } = useTranslation();
  const tp = t.trendingTopicTab.twitter;
  const PERIOD_OPTIONS = [
    { key: "today", label: t.trendingTopicTab.periodToday },
    { key: "week", label: t.trendingTopicTab.periodWeek },
  ] as const;
  const {
    data,
    loading,
    error,
    refetch,
    selectedPostId,
    setSelectedPostId,
    selectedPost,
    period,
    setPeriod,
  } = useTwitterTrending();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t.trendingTopicTab.title}</h2>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
            {tp.subtitle}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1">
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setPeriod(opt.key)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  period === opt.key ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => refetch()}
            disabled={loading}
            className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            {t.accountSentimentTab.refreshButton}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/40 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-white dark:bg-slate-900 py-24 shadow-sm">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-sky-600" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">{t.trendingTopicTab.loadingTitle}</p>
        </div>
      )}

      {!loading && !error && data && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{data.total_topics}</span> {t.trendingTopicTab.totalTopicsSuffix}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">{t.trendingTopicTab.schedulePrefix} {data.schedule}</p>
          </div>

          {(data.topics ?? []).length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 py-16 text-center text-sm text-slate-400 dark:text-slate-500">
              {t.trendingTopicTab.emptyDefault}
            </div>
          ) : (
            <div className="space-y-4">
              {(data.topics ?? []).map((topic, idx) => (
                <TrendingTopicCard
                  key={topic.topic}
                  topic={topic}
                  rank={idx + 1}
                  selectedPostId={selectedPostId}
                  onSelectPost={(post) => setSelectedPostId(post.post_id)}
                />
              ))}
            </div>
          )}

          <CommentsModal
            open={!!selectedPost}
            onClose={() => setSelectedPostId(null)}
            title={t.accountSentimentTab.twitter.repliesModalTitle}
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
