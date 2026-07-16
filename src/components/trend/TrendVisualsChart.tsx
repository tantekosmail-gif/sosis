"use client";

import { useEffect, useState } from "react";
import { Camera, ExternalLink, Images, LayoutGrid } from "lucide-react";

import type { TrendVisualsData } from "@/features/trends/types/visuals.types";
import { getPlatformIcon } from "@/lib/platformIcons";
import { CATEGORICAL_PALETTE, OTHER_COLOR } from "@/lib/chartColors";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const RAIL_SIZE = 4;

// Same fixed slot order as the engagement platform palette, extended with "news" —
// kept local since this widget can surface platforms engagement's colors.ts doesn't cover.
const PLATFORM_ORDER = ["youtube", "tiktok", "twitter", "facebook", "instagram", "news"];
const PLATFORM_COLOR: Record<string, string> = Object.fromEntries(
  PLATFORM_ORDER.map((p, i) => [p, CATEGORICAL_PALETTE[i % CATEGORICAL_PALETTE.length]])
);

function platformColor(platform: string) {
  return PLATFORM_COLOR[platform] ?? OTHER_COLOR;
}

function platformLabel(platform: string) {
  return platform.charAt(0).toUpperCase() + platform.slice(1);
}

function PlatformBadge({ platform }: { platform: string }) {
  const Icon = getPlatformIcon(platform);
  const color = platformColor(platform);
  return (
    <span
      className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full py-1.5 pl-1.5 pr-2.5 shadow-sm ring-1 ring-white/30 backdrop-blur-sm"
      style={{ backgroundColor: `${color}e6` }}
    >
      <Icon size={12} className="text-white" />
      <span className="text-[10px] font-semibold uppercase tracking-wide text-white">{platformLabel(platform)}</span>
    </span>
  );
}

interface Props {
  keywords: string[];
  selectedKeyword: string;
  onSelectKeyword: (keyword: string) => void;
  data: TrendVisualsData;
}

export default function TrendVisualsChart({ keywords, selectedKeyword, onSelectKeyword, data }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { t, language } = useTranslation();

  useEffect(() => {
    setActiveIndex(0);
  }, [selectedKeyword]);

  const items = data.items;
  const active = items[activeIndex] ?? items[0];
  const rail = items.slice(0, RAIL_SIZE);
  const placeholderCount = Math.max(0, RAIL_SIZE - rail.length);
  const hasMore = items.length > RAIL_SIZE;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-5 py-3.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm shadow-indigo-500/30">
          <Images size={17} className="text-white" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t.overviewWidgets.postinganVisual.title}</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">{t.overviewWidgets.postinganVisual.desc}</p>
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
          {t.overviewWidgets.postinganVisual.empty.replace("{keyword}", data.keyword)}
        </p>
      ) : (
        <div className="flex gap-3 p-4">
          <div className="flex-1">
            <a
              href={active.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-video w-full overflow-hidden rounded-xl bg-slate-900"
            >
              {active.thumbnail ? (
                <img
                  src={active.thumbnail}
                  alt=""
                  className="h-full w-full object-cover opacity-90 transition-transform duration-300 group-hover:scale-105 group-hover:opacity-100"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Camera size={28} className="text-slate-600" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              <PlatformBadge platform={active.platform} />

              <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <ExternalLink size={14} />
              </span>

              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="truncate text-[11px] font-medium uppercase tracking-wide text-white/70">
                  {active.author} &middot; {formatRelativeTime(active.published_at, language)}
                </p>
                <p className="mt-1 line-clamp-2 text-lg font-bold leading-snug text-white sm:text-xl">
                  {active.title}
                </p>
              </div>
            </a>

            {rail.length > 1 && (
              <div className="mt-2.5 flex items-center justify-center gap-1.5">
                {rail.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Postingan ${i + 1}`}
                    onClick={() => setActiveIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === activeIndex ? "w-5 bg-indigo-500" : "w-1.5 bg-slate-300 hover:bg-slate-400 dark:bg-slate-700"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex w-16 shrink-0 flex-col gap-2 sm:w-20">
            {rail.map((item, i) => (
              <button
                key={item.post_id}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`group relative aspect-square overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 transition ${
                  i === activeIndex ? "ring-2 ring-indigo-500" : "ring-1 ring-slate-200 hover:ring-slate-300 dark:ring-slate-700"
                }`}
              >
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Camera size={16} className="text-slate-300" />
                  </div>
                )}
                <span
                  className="absolute bottom-0.5 right-0.5 h-2 w-2 rounded-full ring-1 ring-white/60"
                  style={{ backgroundColor: platformColor(item.platform) }}
                />
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
              <div className="flex aspect-square flex-col items-center justify-center gap-0.5 rounded-lg bg-slate-50 dark:bg-slate-950 ring-1 ring-slate-200 dark:ring-slate-800">
                <LayoutGrid size={14} className="text-slate-400 dark:text-slate-500" />
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  +{items.length - RAIL_SIZE}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
