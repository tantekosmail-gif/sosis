"use client";

import { ExternalLink, MessageCircle, Eye } from "lucide-react";

import type { ViralSentimentBreakdown, ViralVideoItem } from "@/features/youtube/types/viral.types";
import FallbackImage from "@/components/common/FallbackImage";
import { decodeHtmlEntities } from "@/lib/decodeHtmlEntities";
import { jetBrainsMono } from "@/lib/fonts/dashboardFonts";

const RANK_STYLE: Record<number, string> = {
  1: "bg-amber-400 text-white",
  2: "bg-slate-400 text-white",
  3: "bg-orange-400 text-white",
};

const SENTIMENT_COLOR: Record<string, string> = {
  positif: "bg-emerald-500",
  netral: "bg-amber-400",
  negatif: "bg-red-500",
};

const SENTIMENT_TEXT: Record<string, string> = {
  positif: "text-emerald-600 dark:text-emerald-400",
  netral: "text-amber-600 dark:text-amber-400",
  negatif: "text-red-600 dark:text-red-400",
};

const SENTIMENT_LABEL: Record<string, string> = {
  positif: "POSITIF",
  netral: "NETRAL",
  negatif: "NEGATIF",
};

function getDominant(summary: ViralSentimentBreakdown): { key: "positif" | "netral" | "negatif"; percentage: number } | null {
  const total = summary.positif.count + summary.netral.count + summary.negatif.count;
  if (total === 0) return null;
  const key = (["positif", "netral", "negatif"] as const).reduce((a, b) => (summary[b].count > summary[a].count ? b : a));
  return { key, percentage: summary[key].percentage };
}

function formatCompact(n: number) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n?.toString() ?? "0";
}

export default function AnalyticsVideoGrid({
  data,
  selectedVideoId,
  onSelectVideo,
}: {
  data: ViralVideoItem[];
  selectedVideoId?: string | null;
  onSelectVideo?: (item: ViralVideoItem) => void;
}) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-500">
        Tidak ada video viral ditemukan
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {data.map((item) => {
        const dominant = getDominant(item.sentiment_summary);
        const isSelected = item.video_id === selectedVideoId;

        return (
          <div
            key={item.video_id}
            className={`group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900 ${
              isSelected ? "border-indigo-400 ring-2 ring-indigo-500/20" : "border-slate-200 dark:border-slate-700"
            }`}
          >
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="relative block aspect-video w-full overflow-hidden">
              <FallbackImage
                src={item.thumbnail_url}
                className="h-full w-full"
                imgClassName="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <span
                className={`${jetBrainsMono.className} absolute left-2 top-2 rounded-md px-2 py-1 text-[10px] font-bold shadow ${
                  RANK_STYLE[item.rank] ?? "bg-slate-900/80 text-white"
                }`}
              >
                #{item.rank}
              </span>
              {item.duration && (
                <span className="absolute bottom-2 right-2 rounded-md bg-black/75 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                  {item.duration}
                </span>
              )}
            </a>

            <div className="p-4">
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-1">
                <h3 className="line-clamp-2 min-w-0 flex-1 break-words text-sm font-semibold leading-snug text-slate-800 transition-colors group-hover:text-indigo-600 dark:text-slate-200">
                  {decodeHtmlEntities(item.title)}
                </h3>
                <ExternalLink size={11} className="mt-0.5 shrink-0 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100 dark:text-slate-500" />
              </a>
              <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">{decodeHtmlEntities(item.channel)}</p>

              <div className={`${jetBrainsMono.className} mt-3 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400`}>
                <span className="flex items-center gap-1">
                  <Eye size={12} className="text-slate-400 dark:text-slate-500" />
                  {formatCompact(item.view_count)}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle size={12} className="text-slate-400 dark:text-slate-500" />
                  {item.comment_count}
                </span>
              </div>

              <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider">
                  <span className="text-slate-400 dark:text-slate-500">Sentimen</span>
                  {dominant ? (
                    <span className={SENTIMENT_TEXT[dominant.key]}>
                      {SENTIMENT_LABEL[dominant.key]} {dominant.percentage.toFixed(0)}%
                    </span>
                  ) : (
                    <span className="text-slate-300 dark:text-slate-600">N/A</span>
                  )}
                </div>
                <div className="mt-1.5 flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  {(["positif", "netral", "negatif"] as const).map((key) =>
                    item.sentiment_summary[key].percentage > 0 ? (
                      <div key={key} className={SENTIMENT_COLOR[key]} style={{ width: `${item.sentiment_summary[key].percentage}%` }} />
                    ) : null
                  )}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end border-t border-slate-100 pt-3 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => onSelectVideo?.(item)}
                  disabled={item.comment_count === 0}
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
