"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, ChevronLeft, ChevronRight, Eye, Flame, Info, MessageCircle, Play } from "lucide-react";

import type { ViralSentimentBreakdown, ViralVideoItem } from "@/features/youtube/types/viral.types";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const STRIP_SIZE = 6;

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
    <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
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
  const strip = items.slice(0, STRIP_SIZE);
  const overflowCount = items.length - strip.length;
  const date = formatDate(active.published_at);

  const goPrev = () => setActiveIndex((i) => (i - 1 + items.length) % items.length);
  const goNext = () => setActiveIndex((i) => (i + 1) % items.length);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-red-500 shadow-sm shadow-orange-500/30">
            <Flame size={18} className="text-white" />
          </div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t.overviewWidgets.videoViral.title}</h2>
        </div>
        <Info size={16} className="text-slate-400 dark:text-slate-500" />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="group relative">
          <a
            href={active.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-900 shadow-inner"
          >
            {active.thumbnail_url && (
              <img
                src={active.thumbnail_url}
                alt=""
                className="h-full w-full object-cover opacity-95 transition-transform duration-500 group-hover:scale-105"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

            <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/25 ring-1 ring-white/40 backdrop-blur-sm transition group-hover:scale-110 group-hover:bg-white/35">
              <Play size={18} className="ml-0.5 fill-white text-white" />
            </span>

            <span
              className={`absolute left-3 top-3 flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-bold ${
                RANK_STYLE[active.rank] ?? "bg-white/20 text-white"
              }`}
            >
              #{active.rank}
            </span>

            {active.duration && (
              <span className="absolute right-3 top-3 rounded-md bg-black/50 px-1.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                {active.duration}
              </span>
            )}

            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    goPrev();
                  }}
                  aria-label="Sebelumnya"
                  className="absolute left-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white opacity-0 backdrop-blur-sm transition hover:bg-black/50 group-hover:opacity-100"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    goNext();
                  }}
                  aria-label="Berikutnya"
                  className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white opacity-0 backdrop-blur-sm transition hover:bg-black/50 group-hover:opacity-100"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}

            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <p className="truncate text-[11px] font-medium uppercase tracking-wide text-white/70">{active.channel}</p>
              <p className="mt-1.5 line-clamp-2 text-lg font-bold leading-snug text-white sm:text-xl">{active.title}</p>
            </div>
          </a>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">
              <Eye size={13} className="text-slate-400 dark:text-slate-500" />
              {formatCompact(active.view_count)}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">
              <MessageCircle size={12} className="text-slate-400 dark:text-slate-500" />
              {formatCompact(active.comment_count)}
            </span>
          </div>
          {date && <span className="text-[11px] text-slate-400 dark:text-slate-500">{date}</span>}
        </div>

        <SentimentBar summary={active.sentiment_summary} />

        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {strip.map((item, i) => (
            <button
              key={item.video_id}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Tampilkan ${item.title}`}
              className={`group relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 transition dark:bg-slate-800 ${
                i === activeIndex
                  ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900"
                  : "opacity-70 ring-1 ring-slate-200 hover:opacity-100 hover:ring-slate-300 dark:ring-slate-700"
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
              <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[9px] font-bold text-white">
                #{item.rank}
              </span>
            </button>
          ))}

          {overflowCount > 0 && (
            <Link
              href="/youtube"
              className="flex aspect-[4/3] w-20 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl bg-slate-50 ring-1 ring-slate-200 transition hover:bg-slate-100 hover:ring-indigo-300 dark:bg-slate-950 dark:ring-slate-800 dark:hover:bg-slate-900"
            >
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">+{overflowCount}</span>
              <span className="text-[9px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-600">
                lainnya
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
