"use client";

import { ExternalLink, Eye, Flame, MessageCircle } from "lucide-react";

import type { ViralSentimentBreakdown, ViralVideoItem } from "@/features/viral/types/viral.types";

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

function SentimentBar({ summary }: { summary: ViralSentimentBreakdown }) {
  const total = summary.positif.count + summary.netral.count + summary.negatif.count;
  if (total === 0) return null;

  return (
    <div className="mt-2 flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
      {(["positif", "netral", "negatif"] as const).map((key) => (
        <div
          key={key}
          className={SENTIMENT_BAR_COLOR[key]}
          style={{ width: `${summary[key].percentage}%` }}
        />
      ))}
    </div>
  );
}

export default function ViralVideoGrid({
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
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400">
        Tidak ada video viral ditemukan
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((item) => {
        const date = formatDate(item.published_at);
        const isSelected = item.video_id === selectedVideoId;

        return (
          <div
            key={item.video_id}
            className={`group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
              isSelected ? "border-indigo-400 ring-2 ring-indigo-500/20" : "border-slate-200"
            }`}
          >
            {/* Thumbnail */}
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block aspect-video w-full overflow-hidden bg-slate-100"
            >
              {item.thumbnail_url ? (
                <img
                  src={item.thumbnail_url}
                  alt=""
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-slate-300">No thumbnail</div>
              )}

              <span className={`absolute left-2 top-2 flex h-6 min-w-6 items-center justify-center rounded-lg px-1.5 text-xs font-bold shadow ${RANK_STYLE[item.rank] ?? "bg-slate-900/80 text-white"}`}>
                #{item.rank}
              </span>

              {item.duration && (
                <span className="absolute bottom-2 right-2 rounded-md bg-black/75 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                  {item.duration}
                </span>
              )}
            </a>

            {/* Content */}
            <div className="p-4">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-1"
              >
                <h3 className="line-clamp-2 flex-1 text-sm font-semibold leading-snug text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h3>
                <ExternalLink size={11} className="mt-0.5 shrink-0 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>

              <p className="mt-1.5 truncate text-xs text-slate-500">{item.channel}</p>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
                  <Eye size={13} className="text-slate-400" />
                  {formatCompact(item.view_count)}
                </div>
                {date && <span className="text-[11px] text-slate-400">{date}</span>}
              </div>

              {item.keyword && (
                <span className="mt-3 inline-flex items-center gap-1 rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700">
                  <Flame size={10} />
                  {item.keyword}
                </span>
              )}

              <SentimentBar summary={item.sentiment_summary} />

              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <MessageCircle size={12} />
                  {item.comment_count} komentar
                </span>

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
