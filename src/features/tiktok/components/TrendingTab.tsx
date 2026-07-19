"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Loader2, RefreshCw } from "lucide-react";

import TrendingTopicCard from "@/components/tiktok/TrendingTopicCard";
import TikTokCommentsList from "@/components/tiktok/TikTokCommentsList";
import CommentsModal from "@/components/common/CommentsModal";
import { useTikTokTrending } from "../hooks/useTikTokTrending";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const SHOW_HEADER = false;
const SHOW_SCHEDULE = false;
const TOPICS_PAGE_SIZE = 6;

export default function TikTokTrendingTab() {
  const { t } = useTranslation();
  const tp = t.trendingTopicTab.tiktok;
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
  } = useTikTokTrending();

  const [visibleCount, setVisibleCount] = useState(TOPICS_PAGE_SIZE);
  useEffect(() => {
    setVisibleCount(TOPICS_PAGE_SIZE);
  }, [data]);

  const topics = data?.topics ?? [];
  const visibleTopics = topics.slice(0, visibleCount);
  const hasMoreTopics = visibleTopics.length < topics.length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        {SHOW_HEADER && (
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t.trendingTopicTab.title}</h2>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
              {tp.subtitle}
            </p>
          </div>
        )}

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
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-rose-600" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">{t.trendingTopicTab.loadingTitle}</p>
        </div>
      )}

      {!loading && !error && data && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{data.total_topics}</span> {t.trendingTopicTab.totalTopicsSuffix}
            </p>
            {SHOW_SCHEDULE && (
              <p className="text-xs text-slate-400 dark:text-slate-500">{t.trendingTopicTab.schedulePrefix} {data.schedule}</p>
            )}
          </div>

          {topics.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 py-16 text-center text-sm text-slate-400 dark:text-slate-500">
              {t.trendingTopicTab.emptyDefault}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
                {visibleTopics.map((topic, idx) => (
                  <TrendingTopicCard
                    key={`${topic.topic}-${idx}`}
                    topic={topic}
                    rank={idx + 1}
                    selectedPostId={selectedPostId}
                    onSelectPost={(post) => setSelectedPostId(post.post_id)}
                  />
                ))}
              </div>

              {hasMoreTopics && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((c) => c + TOPICS_PAGE_SIZE)}
                    className="flex items-center gap-2 rounded-xl border border-emerald-200 dark:border-emerald-900 px-5 py-2.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 transition hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                  >
                    {t.trendingTopicTab.loadMore}
                    <ChevronDown size={15} />
                  </button>
                </div>
              )}
            </>
          )}

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
