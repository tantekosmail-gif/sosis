"use client";

import { ExternalLink, Eye, Heart, MessageCircle, Play } from "lucide-react";

import type { InstagramPostItem, PostSentimentBreakdown } from "@/features/instagram/types/posts.types";

const SENTIMENT_BAR_COLOR: Record<string, string> = {
  positif: "bg-emerald-500",
  netral: "bg-amber-400",
  negatif: "bg-red-500",
};

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return null;
  }
}

function formatCompact(n: number) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n?.toString() ?? "0";
}

function SentimentBar({ summary }: { summary: PostSentimentBreakdown }) {
  const total = summary.positif.count + summary.netral.count + summary.negatif.count;
  if (total === 0) return null;

  return (
    <div className="mt-2 flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
      {(["positif", "netral", "negatif"] as const).map((key) => (
        <div key={key} className={SENTIMENT_BAR_COLOR[key]} style={{ width: `${summary[key].percentage}%` }} />
      ))}
    </div>
  );
}

export default function InstagramPostGrid({
  data,
  selectedPostId,
  onSelectPost,
}: {
  data: InstagramPostItem[];
  selectedPostId?: string | null;
  onSelectPost?: (item: InstagramPostItem) => void;
}) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 py-16 text-center text-sm text-slate-400 dark:text-slate-500">
        Tidak ada postingan ditemukan
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((item) => {
        const date = formatDate(item.published_at);
        const isSelected = item.post_id === selectedPostId;

        return (
          <div
            key={item.post_id}
            className={`overflow-hidden rounded-2xl border bg-white dark:bg-slate-900 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
              isSelected ? "border-indigo-400 ring-2 ring-indigo-500/20" : "border-slate-200 dark:border-slate-700"
            }`}
          >
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="relative block aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              {item.thumbnail ? (
                <img
                  src={item.thumbnail}
                  alt=""
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-slate-300">No thumbnail</div>
              )}

              {item.is_video && (
                <span className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/75 text-white">
                  <Play size={11} fill="currentColor" />
                </span>
              )}
            </a>

            <div className="p-4">
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-1">
                <p className="line-clamp-2 min-w-0 flex-1 break-words text-sm leading-snug text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors">
                  {item.caption || "(tanpa caption)"}
                </p>
                <ExternalLink size={11} className="mt-0.5 shrink-0 text-slate-300" />
              </a>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                    <Heart size={12} className="text-slate-400 dark:text-slate-500" />
                    {formatCompact(item.likes)}
                  </span>
                  {item.is_video && item.views !== undefined && (
                    <span className="flex items-center gap-1">
                      <Eye size={12} className="text-slate-400 dark:text-slate-500" />
                      {formatCompact(item.views)}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <MessageCircle size={12} className="text-slate-400 dark:text-slate-500" />
                    {item.comment_count}
                  </span>
                </div>
                {date && <span className="text-[11px] text-slate-400 dark:text-slate-500">{date}</span>}
              </div>

              <SentimentBar summary={item.sentiment_summary} />

              <div className="mt-3 flex items-center justify-end border-t border-slate-100 dark:border-slate-800 pt-3">
                <button
                  type="button"
                  onClick={() => onSelectPost?.(item)}
                  disabled={item.comments.length === 0}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 disabled:cursor-not-allowed disabled:text-slate-300"
                >
                  {isSelected ? "Ditampilkan" : "Lihat komentar"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
