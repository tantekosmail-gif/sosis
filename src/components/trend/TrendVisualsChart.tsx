"use client";

import { useEffect, useState } from "react";
import { Camera, ChevronLeft, ChevronRight, ExternalLink, Images } from "lucide-react";

import type { TrendVisualsData } from "@/features/trends/types/visuals.types";
import FallbackImage from "@/components/common/FallbackImage";
import { getPlatformIcon } from "@/lib/platformIcons";
import { CATEGORICAL_PALETTE, OTHER_COLOR } from "@/lib/chartColors";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { decodeHtmlEntities } from "@/lib/decodeHtmlEntities";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const STRIP_SIZE = 6;

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
  const strip = items.slice(0, STRIP_SIZE);
  const overflowCount = items.length - strip.length;

  const goPrev = () => setActiveIndex((i) => (i - 1 + items.length) % items.length);
  const goNext = () => setActiveIndex((i) => (i + 1) % items.length);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-5 py-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm shadow-indigo-500/30">
          <Images size={18} className="text-white" />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t.overviewWidgets.postinganVisual.title}</h2>
          <p className="truncate text-xs text-slate-400 dark:text-slate-500">{t.overviewWidgets.postinganVisual.desc}</p>
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
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-14 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800">
            <Camera size={20} className="text-slate-300 dark:text-slate-600" />
          </div>
          <p className="max-w-[220px] text-sm text-slate-400 dark:text-slate-500">
            {t.overviewWidgets.postinganVisual.empty.replace("{keyword}", data.keyword)}
          </p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-3 p-4">
          <a
            href={active.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-900 shadow-inner"
          >
            <FallbackImage
              src={active.thumbnail}
              className="absolute inset-0 h-full w-full"
              imgClassName="h-full w-full object-cover opacity-95 transition-transform duration-500 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

            <PlatformBadge platform={active.platform} />

            <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
              <ExternalLink size={14} />
            </span>

            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    goPrev();
                  }}
                  aria-label={t.common.previous}
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
                  aria-label={t.common.next}
                  className="absolute right-2.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white opacity-0 backdrop-blur-sm transition hover:bg-black/50 group-hover:opacity-100"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}

            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
              <p className="truncate text-[11px] font-medium uppercase tracking-wide text-white/70">
                {decodeHtmlEntities(active.author)} &middot; {formatRelativeTime(active.published_at, language)}
              </p>
              <p className="mt-1.5 line-clamp-2 text-lg font-bold leading-snug text-white sm:text-xl">
                {decodeHtmlEntities(active.title)}
              </p>
            </div>
          </a>

          <div className="flex gap-2 overflow-x-auto pb-0.5">
            {strip.map((item, i) => {
              const Icon = getPlatformIcon(item.platform);
              return (
                <button
                  key={item.post_id}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`group relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 transition dark:bg-slate-800 ${
                    i === activeIndex
                      ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900"
                      : "opacity-70 ring-1 ring-slate-200 hover:opacity-100 hover:ring-slate-300 dark:ring-slate-700"
                  }`}
                >
                  <FallbackImage
                    src={item.thumbnail}
                    className="h-full w-full"
                    imgClassName="h-full w-full object-cover transition-transform group-hover:scale-105"
                    illustrationClassName="h-2/5 w-2/5 max-h-8 max-w-8"
                  />
                  <span
                    className="absolute bottom-1 left-1 flex h-4 w-4 items-center justify-center rounded-full ring-1 ring-white/70"
                    style={{ backgroundColor: platformColor(item.platform) }}
                  >
                    <Icon size={9} className="text-white" />
                  </span>
                </button>
              );
            })}

            {overflowCount > 0 && (
              <div className="flex aspect-[4/3] w-20 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl bg-slate-50 ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800">
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400">+{overflowCount}</span>
                <span className="text-[9px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-600">
                  lainnya
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
