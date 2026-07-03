"use client";

import { ExternalLink, Eye, Flame, MessageCircle, Users } from "lucide-react";

import type { TrendingAccount, TrendingPost, TrendingSentimentBreakdown } from "@/features/instagram/types/trending.types";

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

function formatCompact(n: number) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n?.toString() ?? "0";
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
  post: TrendingPost;
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
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100"
      >
        {post.thumbnail ? (
          <img
            src={post.thumbnail}
            alt=""
            className="h-full w-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : null}
      </a>

      <div className="min-w-0 flex-1">
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-1 text-xs font-medium leading-snug text-slate-700 hover:text-indigo-600"
        >
          <span className="line-clamp-2 flex-1">{post.caption}</span>
          <ExternalLink size={10} className="mt-0.5 shrink-0 text-slate-300" />
        </a>

        <div className="mt-1.5 flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Eye size={11} />
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

export default function TrendingAccountCard({
  account,
  selectedPostId,
  onSelectPost,
}: {
  account: TrendingAccount;
  selectedPostId?: string | null;
  onSelectPost?: (post: TrendingPost) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="flex items-center gap-3">
          <span className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-1.5 text-sm font-bold ${RANK_STYLE[account.rank] ?? "bg-slate-900/80 text-white"}`}>
            #{account.rank}
          </span>
          <div>
            <p className="font-semibold text-slate-900">{account.display_name}</p>
            <p className="text-xs text-slate-400">@{account.username}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 text-right text-xs text-slate-500">
          <Users size={13} className="text-slate-400" />
          <span className="font-semibold text-slate-700">{formatCompact(account.followers)}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 px-5 pb-4">
        <MetricPill label="Trending" value={account.trending_score.toFixed(2)} />
        <MetricPill label="Engagement" value={`${account.engagement_rate.toFixed(1)}%`} />
        <MetricPill label="Virality" value={account.virality_score.toFixed(3)} />
      </div>

      <div className="flex flex-wrap items-center gap-2 px-5 pb-4">
        {account.discovered_via && (
          <span className="inline-flex items-center gap-1 rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700">
            <Flame size={10} />
            {account.discovered_via}
          </span>
        )}
        {account.source && (
          <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500">
            {account.source}
          </span>
        )}
      </div>

      <div className="px-5 pb-4">
        <SentimentBar sentiment={account.sentiment} />
      </div>

      <div className="border-t border-slate-100 px-5 py-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Postingan Terbaru</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {account.posts.map((post) => (
            <PostMiniCard
              key={post.post_id}
              post={post}
              isSelected={post.post_id === selectedPostId}
              onSelect={() => onSelectPost?.(post)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
