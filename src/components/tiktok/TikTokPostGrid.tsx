"use client";

import { ExternalLink, Eye, MessageCircle, Share2, ThumbsUp } from "lucide-react";

import type { TikTokPostItem, TikTokSentimentBreakdown } from "@/features/tiktok/types/posts.types";

const SENTIMENT_BAR_COLOR: Record<string, string> = {
  positif: "bg-emerald-500",
  netral: "bg-amber-400",
  negatif: "bg-red-500",
};

const SENTIMENT_LABEL: Record<string, string> = {
  positif: "Positif",
  netral: "Netral",
  negatif: "Negatif",
};

function getDominantSentiment(summary: TikTokSentimentBreakdown): "positif" | "netral" | "negatif" | null {
  const total = summary.positif.count + summary.netral.count + summary.negatif.count;
  if (total === 0) return null;
  return (["positif", "netral", "negatif"] as const).reduce((a, b) => (summary[b].count > summary[a].count ? b : a));
}

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

function formatCompact(n?: number) {
  if (n === undefined || n === null) return "0";
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

function SentimentBar({ summary }: { summary: TikTokSentimentBreakdown }) {
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

export default function TikTokPostGrid({
  data,
  selectedPostId,
  onSelectPost,
}: {
  data: TikTokPostItem[];
  selectedPostId?: string | null;
  onSelectPost?: (item: TikTokPostItem) => void;
}) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white dark:bg-slate-900 py-16 text-center text-sm text-slate-400 dark:text-slate-500">
        Tidak ada video ditemukan
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((item) => {
        const date = formatDate(item.published_at);
        const isSelected = item.post_id === selectedPostId;
        const dominant = getDominantSentiment(item.sentiment_summary);

        return (
          <div
            key={item.post_id}
            className={`overflow-hidden rounded-2xl border bg-white dark:bg-slate-900 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
              isSelected ? "border-rose-400 ring-2 ring-rose-500/20" : "border-slate-200 dark:border-slate-700"
            }`}
          >
            {item.thumbnail && (
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="relative block aspect-[9/16] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={item.thumbnail}
                  alt=""
                  className="h-full w-full object-cover transition-transform hover:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />

                {dominant && (
                  <span
                    title={`Dominan: ${SENTIMENT_LABEL[dominant]}`}
                    className={`absolute left-2 top-2 h-3 w-3 rounded-full ring-2 ring-white dark:ring-slate-900 ${SENTIMENT_BAR_COLOR[dominant]}`}
                  />
                )}
              </a>
            )}

            <div className="p-4">
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-1">
                <p className="line-clamp-2 min-w-0 flex-1 break-words text-sm leading-snug text-slate-700 dark:text-slate-300 hover:text-rose-600 transition-colors">
                  {item.caption || "(tanpa caption)"}
                </p>
                <ExternalLink size={11} className="mt-0.5 shrink-0 text-slate-300" />
              </a>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                  <ThumbsUp size={12} className="text-slate-400 dark:text-slate-500" />
                  {formatCompact(item.likes)}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle size={12} className="text-slate-400 dark:text-slate-500" />
                  {item.comment_count}
                </span>
                {item.share_count !== undefined && (
                  <span className="flex items-center gap-1">
                    <Share2 size={12} className="text-slate-400 dark:text-slate-500" />
                    {formatCompact(item.share_count)}
                  </span>
                )}
                {item.view_count !== undefined && (
                  <span className="flex items-center gap-1">
                    <Eye size={12} className="text-slate-400 dark:text-slate-500" />
                    {formatCompact(item.view_count)}
                  </span>
                )}
              </div>
              {date && <span className="mt-1 block text-[11px] text-slate-400 dark:text-slate-500">{date}</span>}

              <SentimentBar summary={item.sentiment_summary} />

              <div className="mt-3 flex items-center justify-end border-t border-slate-100 dark:border-slate-800 pt-3">
                <button
                  type="button"
                  onClick={() => onSelectPost?.(item)}
                  disabled={item.comments.length === 0}
                  className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 disabled:cursor-not-allowed disabled:text-slate-300"
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
