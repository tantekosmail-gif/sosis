"use client";

import { ExternalLink, MessageCircle, Repeat2, ThumbsUp } from "lucide-react";

import type { ThreadsPost } from "@/features/threads/types/search.types";
import SentimentBreakdownBar, { type SentimentBreakdownSummary } from "@/components/common/SentimentBreakdownBar";
import FallbackImage from "@/components/common/FallbackImage";

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
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

export function buildSentimentSummary(post: ThreadsPost): SentimentBreakdownSummary {
  const totals = { positif: 0, netral: 0, negatif: 0 };
  for (const comment of post.comments) {
    const key = comment.sentiment?.toLowerCase();
    if (key === "positif" || key === "netral" || key === "negatif") totals[key] += 1;
  }
  const total = totals.positif + totals.netral + totals.negatif;
  const pct = (count: number) => (total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0);
  return {
    positif: { count: totals.positif, percentage: pct(totals.positif) },
    netral: { count: totals.netral, percentage: pct(totals.netral) },
    negatif: { count: totals.negatif, percentage: pct(totals.negatif) },
  };
}

export default function ThreadsPostGrid({
  data,
  selectedPostId,
  onSelectPost,
}: {
  data: ThreadsPost[];
  selectedPostId?: string | null;
  onSelectPost?: (item: ThreadsPost) => void;
}) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white dark:bg-slate-900 py-16 text-center text-sm text-slate-400 dark:text-slate-500">
        Tidak ada post Threads ditemukan
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((item) => {
        const date = formatDate(item.published_at);
        const isSelected = item.id === selectedPostId;
        const image = item.media.find((m) => m.type === "image")?.url;

        return (
          <div
            key={item.id}
            className={`overflow-hidden rounded-2xl border bg-white dark:bg-slate-900 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
              isSelected ? "border-purple-400 ring-2 ring-purple-500/20" : "border-slate-200 dark:border-slate-700"
            }`}
          >
            {image && (
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="relative block aspect-[16/9] w-full overflow-hidden">
                <FallbackImage
                  src={image}
                  className="h-full w-full"
                  imgClassName="h-full w-full object-cover transition-transform hover:scale-105"
                />
              </a>
            )}

            <div className="p-4">
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-1">
                <p className="line-clamp-3 min-w-0 flex-1 whitespace-pre-line break-words text-sm leading-snug text-slate-700 dark:text-slate-300 hover:text-purple-600 transition-colors">
                  {item.content || "(tanpa teks)"}
                </p>
                <ExternalLink size={11} className="mt-0.5 shrink-0 text-slate-300" />
              </a>

              <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">@{item.author}</p>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                    <ThumbsUp size={12} className="text-slate-400 dark:text-slate-500" />
                    {formatCompact(item.likes)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={12} className="text-slate-400 dark:text-slate-500" />
                    {formatCompact(item.replies)}
                  </span>
                  {item.reposts > 0 && (
                    <span className="flex items-center gap-1">
                      <Repeat2 size={12} className="text-slate-400 dark:text-slate-500" />
                      {formatCompact(item.reposts)}
                    </span>
                  )}
                </div>
                {date && <span className="text-[11px] text-slate-400 dark:text-slate-500">{date}</span>}
              </div>

              <SentimentBreakdownBar summary={buildSentimentSummary(item)} />

              <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  {item.comment_count} balasan tersimpan
                </span>
                <button
                  type="button"
                  onClick={() => onSelectPost?.(item)}
                  disabled={item.comments.length === 0}
                  className="text-[11px] font-semibold text-purple-600 hover:text-purple-700 disabled:cursor-not-allowed disabled:text-slate-300"
                >
                  {isSelected ? "Ditampilkan" : "Lihat balasan"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
