"use client";

import { useEffect, useState } from "react";
import { Camera, ExternalLink, Images, LayoutGrid } from "lucide-react";

import type { TrendVisualsData } from "@/features/trends/types/visuals.types";
import { getPlatformIcon } from "@/lib/platformIcons";

const RAIL_SIZE = 4;

function PlatformBadge({ platform }: { platform: string }) {
  const Icon = getPlatformIcon(platform);
  return (
    <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/25 ring-1 ring-white/40 backdrop-blur-sm">
      <Icon size={14} className="text-white" />
    </span>
  );
}

function formatRelativeTime(dateStr?: string) {
  if (!dateStr) return "";
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMin = Math.round(diffMs / 60_000);
  if (diffMin < 1) return "baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;
  const diffDay = Math.round(diffHour / 24);
  return `${diffDay} hari lalu`;
}

interface Props {
  keywords: string[];
  selectedKeyword: string;
  onSelectKeyword: (keyword: string) => void;
  data: TrendVisualsData;
}

export default function TrendVisualsChart({ keywords, selectedKeyword, onSelectKeyword, data }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [selectedKeyword]);

  const items = data.items;
  const active = items[activeIndex] ?? items[0];
  const rail = items.slice(0, RAIL_SIZE);
  const placeholderCount = Math.max(0, RAIL_SIZE - rail.length);
  const hasMore = items.length > RAIL_SIZE;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-5 py-3.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40">
          <Images size={17} className="text-indigo-600" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Postingan Visual</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">Postingan lintas platform untuk keyword trending</p>
        </div>
      </div>

      {keywords.length > 0 && (
        <div className="flex gap-2 overflow-x-auto border-b border-slate-100 dark:border-slate-800 px-4 py-3">
          {keywords.map((kw) => (
            <button
              key={kw}
              type="button"
              onClick={() => onSelectKeyword(kw)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                kw === selectedKeyword
                  ? "bg-indigo-600 text-white shadow shadow-indigo-500/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {kw}
            </button>
          ))}
        </div>
      )}

      {items.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-400 dark:text-slate-500">
          Tidak ada postingan untuk keyword &quot;{data.keyword}&quot;
        </p>
      ) : (
        <div className="flex gap-3 p-4">
          <a
            href={active.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-video w-full flex-1 overflow-hidden rounded-xl bg-slate-900"
          >
            {active.thumbnail ? (
              <img
                src={active.thumbnail}
                alt=""
                className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Camera size={28} className="text-slate-600" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

            <PlatformBadge platform={active.platform} />

            <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
              <ExternalLink size={14} />
            </span>

            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="truncate text-[11px] font-medium uppercase tracking-wide text-white/70">
                {active.author} &middot; {formatRelativeTime(active.published_at)}
              </p>
              <p className="mt-1 line-clamp-2 text-lg font-bold leading-snug text-white sm:text-xl">
                {active.title}
              </p>
            </div>
          </a>

          <div className="flex w-16 shrink-0 flex-col gap-2 sm:w-20">
            {rail.map((item, i) => (
              <button
                key={item.post_id}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`relative aspect-square overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 transition ${
                  i === activeIndex ? "ring-2 ring-indigo-500" : "ring-1 ring-slate-200 hover:ring-slate-300"
                }`}
              >
                {item.thumbnail ? (
                  <img src={item.thumbnail} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Camera size={16} className="text-slate-300" />
                  </div>
                )}
              </button>
            ))}

            {Array.from({ length: placeholderCount }).map((_, i) => (
              <div
                key={`placeholder-${i}`}
                className="flex aspect-square items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 ring-1 ring-slate-200"
              >
                <Camera size={16} className="text-slate-300" />
              </div>
            ))}

            {hasMore && (
              <div className="flex aspect-square items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-950 ring-1 ring-slate-200">
                <LayoutGrid size={15} className="text-slate-400 dark:text-slate-500" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
