"use client";

import { Eye, ExternalLink, Hash, MessageCircle, Repeat2, ThumbsUp } from "lucide-react";

import type { TwitterTrendingPost, TwitterTrendingTopic } from "@/features/twitter/types/trending.types";
import SentimentBar from "@/components/common/SentimentBreakdownBar";

const RANK_STYLE: Record<number, string> = {
  1: "bg-amber-400 text-white",
  2: "bg-slate-400 text-white",
  3: "bg-orange-400 text-white",
};

const STATUS_STYLE: Record<string, string> = {
  pending: "border-amber-200 bg-amber-50 dark:bg-amber-950/40 text-amber-700",
  done: "border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700",
  completed: "border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700",
  failed: "border-red-200 bg-red-50 dark:bg-red-950/40 text-red-700",
};

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

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-200">{value}</p>
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
        isSelected ? "border-sky-400 bg-sky-50/40" : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"
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

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="flex items-center gap-3">
          <span className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-1.5 text-sm font-bold ${RANK_STYLE[rank] ?? "bg-slate-900/80 text-white"}`}>
            #{rank}
          </span>
          <div>
            <p className="flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-100">
              <Hash size={14} className="text-slate-400 dark:text-slate-500" />
              {topic.topic}
            </p>
            {topic.twitter_identifier && <p className="text-xs text-slate-400 dark:text-slate-500">Sumber: @{topic.twitter_identifier}</p>}
          </div>
        </div>

        <span className={`inline-flex shrink-0 items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold capitalize ${statusStyle}`}>
          {topic.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 px-5 pb-4">
        <MetricPill label="Skor Trending" value={topic.score.toFixed(2)} />
        <MetricPill label="Jumlah Tweet" value={String(topic.posts.length)} />
      </div>

      <div className="px-5 pb-4">
        <SentimentBar summary={topic.sentiment} />
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Tweet Terkait</p>
        {topic.posts.length === 0 ? (
          <p className="text-sm text-slate-400 dark:text-slate-500">Belum ada tweet untuk topik ini</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {topic.posts.map((post) => (
              <PostMiniCard
                key={post.post_id}
                post={post}
                isSelected={post.post_id === selectedPostId}
                onSelect={() => onSelectPost?.(post)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
