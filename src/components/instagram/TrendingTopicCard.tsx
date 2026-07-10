"use client";

import { ExternalLink, Hash, MessageCircle, ThumbsUp } from "lucide-react";

import type { InstagramTrendingPost, TrendingSentimentBreakdown, InstagramTrendingTopic } from "@/features/instagram/types/trending.types";

const RANK_STYLE: Record<number, string> = {
  1: "bg-amber-400 text-white",
  2: "bg-slate-400 text-white",
  3: "bg-orange-400 text-white",
};

const SENTIMENT_BAR_COLOR: Record<string, string> = {
  positif: "bg-emerald-500",
  netral: "bg-amber-400",
  negatif: "bg-red-500",
};

const STATUS_STYLE: Record<string, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  used: "border-emerald-200 bg-emerald-50 text-emerald-700",
  done: "border-emerald-200 bg-emerald-50 text-emerald-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  failed: "border-red-200 bg-red-50 text-red-700",
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

function SentimentBar({ sentiment }: { sentiment: TrendingSentimentBreakdown }) {
  const total = sentiment.positif.count + sentiment.netral.count + sentiment.negatif.count;
  if (total === 0) return null;

  return (
    <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
      {(["positif", "netral", "negatif"] as const).map((key) => (
        <div key={key} className={SENTIMENT_BAR_COLOR[key]} style={{ width: `${sentiment[key].percentage}%` }} />
      ))}
    </div>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}

function PostMiniCard({
  post,
  isSelected,
  onSelect,
}: {
  post: InstagramTrendingPost;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const date = formatDate(post.published_at);

  return (
    <div
      className={`flex gap-3 rounded-xl border p-3 transition-colors ${
        isSelected ? "border-indigo-400 bg-indigo-50/40" : "border-slate-100 bg-white"
      }`}
    >
      {post.thumbnail && (
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100"
        >
          <img
            src={post.thumbnail}
            alt=""
            className="h-full w-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </a>
      )}

      <div className="min-w-0 flex-1">
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-1 text-xs font-medium leading-snug text-slate-700 hover:text-indigo-600"
        >
          <span className="line-clamp-3 min-w-0 flex-1 break-words">{post.caption || "(tanpa caption)"}</span>
          <ExternalLink size={10} className="mt-0.5 shrink-0 text-slate-300" />
        </a>

        <div className="mt-1.5 flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <ThumbsUp size={11} />
            {formatCompact(post.likes)}
          </span>
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
          className="mt-1.5 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 disabled:cursor-not-allowed disabled:text-slate-300"
        >
          {isSelected ? "Ditampilkan" : "Lihat komentar"}
        </button>
      </div>
    </div>
  );
}

export default function TrendingTopicCard({
  topic,
  rank,
  selectedPostId,
  onSelectPost,
}: {
  topic: InstagramTrendingTopic;
  rank: number;
  selectedPostId?: string | null;
  onSelectPost?: (post: InstagramTrendingPost) => void;
}) {
  const statusStyle = STATUS_STYLE[topic.status?.toLowerCase()] ?? "border-slate-200 bg-slate-50 text-slate-500";

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="flex items-center gap-3">
          <span className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-1.5 text-sm font-bold ${RANK_STYLE[rank] ?? "bg-slate-900/80 text-white"}`}>
            #{rank}
          </span>
          <div>
            <p className="flex items-center gap-1 font-semibold text-slate-900">
              <Hash size={14} className="text-slate-400" />
              {topic.topic}
            </p>
            {topic.instagram_identifier && <p className="text-xs text-slate-400">Sumber: @{topic.instagram_identifier}</p>}
          </div>
        </div>

        <span className={`inline-flex shrink-0 items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold capitalize ${statusStyle}`}>
          {topic.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 px-5 pb-4">
        <MetricPill label="Skor Trending" value={topic.score.toFixed(2)} />
        <MetricPill label="Jumlah Post" value={String(topic.posts.length)} />
      </div>

      <div className="px-5 pb-4">
        <SentimentBar sentiment={topic.sentiment} />
      </div>

      <div className="border-t border-slate-100 px-5 py-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Postingan Terkait</p>
        {topic.posts.length === 0 ? (
          <p className="text-sm text-slate-400">Belum ada postingan untuk topik ini</p>
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
