"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, Eye, Flame, Info, LayoutGrid, MessageCircle, Play } from "lucide-react";

import type { ViralSentimentBreakdown, ViralVideoItem } from "@/features/youtube/types/viral.types";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const RAIL_SIZE = 4;

const RANK_STYLE: Record<number, string> = {
  1: "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-sm shadow-amber-500/40",
  2: "bg-gradient-to-br from-slate-300 to-slate-500 text-white",
  3: "bg-gradient-to-br from-orange-300 to-orange-500 text-white",
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

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return null;
  }
}

function SentimentBar({ summary }: { summary?: ViralSentimentBreakdown }) {
  if (!summary) return null;
  const total = summary.positif.count + summary.netral.count + summary.negatif.count;
  if (total === 0) return null;

  return (
    <div className="flex h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
      {(["positif", "netral", "negatif"] as const).map((key) => (
        <div key={key} className={SENTIMENT_BAR_COLOR[key]} style={{ width: `${summary[key].percentage}%` }} />
      ))}
    </div>
  );
}

export default function VisualsPreviewWidget({ items }: { items: ViralVideoItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { t } = useTranslation();

  if (!items || items.length === 0) return null;

  const active = items[activeIndex] ?? items[0];
  const rail = items.slice(0, RAIL_SIZE);
  const placeholderCount = Math.max(0, RAIL_SIZE - rail.length);
  const hasMore = items.length > RAIL_SIZE;
  const date = formatDate(active.published_at);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-red-500 shadow-sm shadow-orange-500/30">
            <Flame size={17} className="text-white" />
          </div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t.overviewWidgets.videoViral.title}</h2>
        </div>
        <Info size={16} className="text-slate-400 dark:text-slate-500" />
      </div>

      <div className="flex flex-1 gap-3 p-4">
        <div className="group relative flex h-full flex-1 flex-col">
          <a
            href={active.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block w-full flex-1 overflow-hidden rounded-xl bg-slate-900"
          >
            {active.thumbnail_url && (
              <img
                src={active.thumbnail_url}
                alt=""
                className="h-full w-full object-cover opacity-90 transition-transform duration-300 group-hover:scale-105 group-hover:opacity-100"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/25 ring-1 ring-white/40 backdrop-blur-sm transition group-hover:scale-110 group-hover:bg-white/35">
              <Play size={16} className="ml-0.5 fill-white text-white" />
            </span>

            <div className="absolute inset-x-0 bottom-0 p-4">
              <div className="mb-1 flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-1.5">
                  <span
                    className={`inline-flex h-4 shrink-0 items-center justify-center rounded px-1 text-[10px] font-bold ${
                      RANK_STYLE[active.rank] ?? "bg-white/20 text-white"
                    }`}
                  >
                    #{active.rank}
                  </span>
                  <p className="truncate text-[11px] font-medium uppercase tracking-wide text-white/70">
                    {active.channel}
                  </p>
                </div>
                {active.duration && (
                  <span className="shrink-0 rounded-md bg-black/40 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                    {active.duration}
                  </span>
                )}
              </div>
              <p className="line-clamp-2 text-lg font-bold leading-snug text-white sm:text-xl">
                {active.title}
              </p>
            </div>
          </a>

          <div className="mt-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1">
                <Eye size={13} className="text-slate-400 dark:text-slate-500" />
                {formatCompact(active.view_count)}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle size={12} className="text-slate-400 dark:text-slate-500" />
                {formatCompact(active.comment_count)}
              </span>
            </div>
            {date && <span className="text-[11px] text-slate-400 dark:text-slate-500">{date}</span>}
          </div>

          <div className="mt-2">
            <SentimentBar summary={active.sentiment_summary} />
          </div>
        </div>

        <div className="flex h-full w-16 shrink-0 flex-col gap-2 sm:w-20">
          {rail.map((item, i) => (
            <button
              key={item.video_id}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Tampilkan ${item.title}`}
              className={`group relative flex-1 overflow-hidden rounded-lg bg-slate-100 transition dark:bg-slate-800 ${
                i === activeIndex ? "ring-2 ring-indigo-500" : "ring-1 ring-slate-200 hover:ring-slate-300 dark:ring-slate-700"
              }`}
            >
              {item.thumbnail_url ? (
                <img
                  src={item.thumbnail_url}
                  alt=""
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Camera size={16} className="text-slate-300" />
                </div>
              )}
              <span className="absolute bottom-0.5 right-0.5 rounded bg-black/60 px-1 text-[9px] font-bold text-white">
                #{item.rank}
              </span>
            </button>
          ))}

          {Array.from({ length: placeholderCount }).map((_, i) => (
            <div
              key={`placeholder-${i}`}
              className="flex flex-1 items-center justify-center rounded-lg bg-slate-100 ring-1 ring-slate-200 dark:bg-slate-800"
            >
              <Camera size={16} className="text-slate-300" />
            </div>
          ))}

          {hasMore && (
            <Link
              href="/youtube"
              className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg bg-slate-50 ring-1 ring-slate-200 transition hover:bg-slate-100 hover:ring-indigo-300 dark:bg-slate-950 dark:ring-slate-800 dark:hover:bg-slate-900"
            >
              <LayoutGrid size={14} className="text-slate-400 dark:text-slate-500" />
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                +{items.length - RAIL_SIZE}
              </span>
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 border-t border-slate-100 bg-slate-50 py-2.5 dark:border-slate-800 dark:bg-slate-950">
        {rail.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Video ${i + 1}`}
            onClick={() => setActiveIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === activeIndex ? "w-5 bg-indigo-500" : "w-1.5 bg-slate-300 hover:bg-slate-400 dark:bg-slate-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
