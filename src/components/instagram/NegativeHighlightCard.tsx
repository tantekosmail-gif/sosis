"use client";

import { AlertTriangle, ExternalLink, Heart, MessageCircle } from "lucide-react";

import type { InstagramPostItem } from "@/features/instagram/types/posts.types";

function findMostNegativePost(items: InstagramPostItem[]): InstagramPostItem | null {
  let best: InstagramPostItem | null = null;
  let bestPercentage = 0;

  for (const item of items) {
    const s = item.sentiment_summary;
    const total = s.positif.count + s.netral.count + s.negatif.count;
    if (total === 0) continue;
    if (s.negatif.percentage > bestPercentage) {
      bestPercentage = s.negatif.percentage;
      best = item;
    }
  }

  return bestPercentage > 0 ? best : null;
}

export default function NegativeHighlightCard({
  items,
  onSelect,
}: {
  items: InstagramPostItem[];
  onSelect?: (item: InstagramPostItem) => void;
}) {
  const post = findMostNegativePost(items);
  if (!post) return null;

  return (
    <div className="flex gap-4 rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 p-4 shadow-sm">
      {post.thumbnail && (
        <a href={post.url} target="_blank" rel="noopener noreferrer" className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
          <img
            src={post.thumbnail}
            alt=""
            className="h-full w-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </a>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-red-700 dark:text-red-400">
          <AlertTriangle size={13} />
          Post Paling Disorot Negatif
        </div>

        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1.5 flex items-start gap-1 text-sm text-slate-700 dark:text-slate-300 hover:text-red-700 dark:hover:text-red-400"
        >
          <span className="line-clamp-2 min-w-0 flex-1 break-words">{post.caption || "(tanpa caption)"}</span>
          <ExternalLink size={11} className="mt-0.5 shrink-0 text-slate-300" />
        </a>

        <div className="mt-2 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Heart size={12} />
            {post.likes}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle size={12} />
            {post.comment_count}
          </span>
          <span className="font-semibold text-red-700 dark:text-red-400">
            {post.sentiment_summary.negatif.percentage.toFixed(1)}% negatif
          </span>
        </div>

        <button
          type="button"
          onClick={() => onSelect?.(post)}
          disabled={post.comments.length === 0}
          className="mt-2 text-xs font-semibold text-red-700 hover:text-red-800 dark:text-red-400 disabled:cursor-not-allowed disabled:text-slate-300"
        >
          Lihat komentar
        </button>
      </div>
    </div>
  );
}
