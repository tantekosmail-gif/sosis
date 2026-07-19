"use client";

import { Activity, AtSign, Eye, ExternalLink, Hash, MessageCircle, Repeat2, ThumbsUp } from "lucide-react";

import type { TwitterTrendingPost, TwitterTrendingTopic } from "@/features/twitter/types/trending.types";
import SentimentBar from "@/components/common/SentimentBreakdownBar";
import { hankenGrotesk } from "@/lib/fonts/dashboardFonts";

const SHOW_STATUS_BADGE = false;

const STATUS_STYLE: Record<string, string> = {
  pending: "border-amber-200 bg-amber-50 dark:bg-amber-950/40 text-amber-700",
  done: "border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700",
  completed: "border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700",
  failed: "border-red-200 bg-red-50 dark:bg-red-950/40 text-red-700",
};

const SENTIMENT_LABEL: Record<string, string> = { positif: "Positif", netral: "Netral", negatif: "Negatif" };
const SENTIMENT_TEXT_COLOR: Record<string, string> = {
  positif: "text-emerald-600 dark:text-emerald-400",
  netral: "text-slate-500 dark:text-slate-400",
  negatif: "text-red-600 dark:text-red-400",
};

function getDominantSentiment(sentiment: TwitterTrendingTopic["sentiment"]) {
  const total = sentiment.positif.count + sentiment.netral.count + sentiment.negatif.count;
  if (total === 0) return null;
  return (["positif", "netral", "negatif"] as const).reduce((a, b) => (sentiment[b].count > sentiment[a].count ? b : a));
}

function formatCompact(n?: number) {
  if (n === undefined || n === null) return "0";
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return null;
  }
}

function StatBox({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) {
  return (
    <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</p>
      <p className={`mt-0.5 text-lg font-bold ${valueClassName ?? "text-slate-800 dark:text-slate-200"}`}>{value}</p>
    </div>
  );
}

function PostMiniCard({
  post,
  isSelected,
  onSelect,
}: {
  post: TwitterTrendingPost;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const date = formatDate(post.published_at);

  return (
    <div
      className={`rounded-xl border p-3 transition-colors ${
        isSelected ? "border-sky-400 bg-sky-50/40" : "border-transparent bg-slate-50 dark:bg-slate-950"
      }`}
    >
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-1 text-xs font-medium leading-snug text-slate-700 dark:text-slate-300 hover:text-sky-600"
      >
        <span className="line-clamp-3 min-w-0 flex-1 break-words">{post.caption || "(tanpa teks)"}</span>
        <ExternalLink size={10} className="mt-0.5 shrink-0 text-slate-300" />
      </a>

      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500">
        <span className="flex items-center gap-1">
          <ThumbsUp size={11} />
          {formatCompact(post.likes)}
        </span>
        <span className="flex items-center gap-1">
          <Repeat2 size={11} />
          {formatCompact(post.retweet_count)}
        </span>
        {post.view_count !== undefined && (
          <span className="flex items-center gap-1">
            <Eye size={11} />
            {formatCompact(post.view_count)}
          </span>
        )}
        <span className="flex items-center gap-1">
          <MessageCircle size={11} />
          {post.comment_count}
        </span>
        {date && <span>{date}</span>}
      </div>

      <button
        type="button"
        onClick={onSelect}
        disabled={post.comments.length === 0}
        className="mt-1.5 text-[11px] font-semibold text-sky-600 hover:text-sky-700 disabled:cursor-not-allowed disabled:text-slate-300"
      >
        {isSelected ? "Ditampilkan" : "Lihat balasan"}
      </button>
    </div>
  );
}

export default function TrendingTopicCard({
  topic,
  rank,
  selectedPostId,
  onSelectPost,
}: {
  topic: TwitterTrendingTopic;
  rank: number;
  selectedPostId?: string | null;
  onSelectPost?: (post: TwitterTrendingPost) => void;
}) {
  const statusStyle = STATUS_STYLE[topic.status?.toLowerCase()] ?? "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-500";
  const dominant = getDominantSentiment(topic.sentiment);
  const displayedPosts = topic.posts.slice(0, 2);
  const extraCount = topic.posts.length - displayedPosts.length;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
      <div className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <p className={`${hankenGrotesk.className} flex items-center gap-1.5 text-lg font-bold text-slate-900 dark:text-slate-100`}>
            <span>#{rank}</span>
            <Hash size={15} className="shrink-0 text-slate-400 dark:text-slate-500" />
            <span className="truncate">{topic.topic}</span>
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 dark:text-slate-500">
            {topic.twitter_identifier && (
              <span className="flex items-center gap-1">
                <AtSign size={11} />
                {topic.twitter_identifier}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Activity size={11} />
              Skor: {topic.score.toFixed(2)}
            </span>
          </div>
        </div>

        {SHOW_STATUS_BADGE && (
          <span className={`inline-flex shrink-0 items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold capitalize ${statusStyle}`}>
            {topic.status}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 px-5 pb-4">
        <StatBox label="Jumlah Tweet" value={String(topic.posts.length)} />
        <StatBox
          label="Sentimen"
          value={dominant ? SENTIMENT_LABEL[dominant] : "-"}
          valueClassName={dominant ? SENTIMENT_TEXT_COLOR[dominant] : undefined}
        />
      </div>

      <div className="px-5 pb-4">
        <SentimentBar summary={topic.sentiment} />
      </div>

      <div className="flex-1 border-t border-slate-100 dark:border-slate-800 px-5 py-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Tweet Terkait</p>
        {topic.posts.length === 0 ? (
          <p className="text-sm text-slate-400 dark:text-slate-500">Belum ada tweet untuk topik ini</p>
        ) : (
          <div className="space-y-3">
            {displayedPosts.map((post) => (
              <PostMiniCard
                key={post.post_id}
                post={post}
                isSelected={post.post_id === selectedPostId}
                onSelect={() => onSelectPost?.(post)}
              />
            ))}
            {extraCount > 0 && (
              <p className="text-[11px] text-slate-400 dark:text-slate-500">+{extraCount} tweet lainnya</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
