"use client";

import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { ExternalLink, Eye, MessageCircle } from "lucide-react";

import SentimentBar from "@/components/common/SentimentBreakdownBar";
import FallbackImage from "@/components/common/FallbackImage";
import type { ViralVideoItem } from "@/features/youtube/types/viral.types";
import { decodeHtmlEntities } from "@/lib/decodeHtmlEntities";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const RANK_STYLE: Record<number, string> = {
  1: "bg-amber-400 text-white",
  2: "bg-slate-400 text-white",
  3: "bg-orange-400 text-white",
};

// Tanggal ditampilkan relatif ("1 hari yang lalu" / "1 day ago") mengikuti
// bahasa aktif; tanggal absolutnya tetap tersedia lewat tooltip (atribut title).
function formatRelativeDate(dateStr: string | undefined, language: string) {
  const date = dateStr ? new Date(dateStr) : null;
  if (!date || isNaN(date.getTime())) return null;
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: language === "id" ? idLocale : undefined,
  });
}

function formatAbsoluteDate(dateStr?: string) {
  const date = dateStr ? new Date(dateStr) : null;
  if (!date || isNaN(date.getTime())) return undefined;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function formatCompact(n: number) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n?.toString() ?? "0";
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
  const { language } = useTranslation();

  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-500">
        Tidak ada video viral ditemukan
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((item) => {
        const date = formatRelativeDate(item.published_at, language);
        const isSelected = item.video_id === selectedVideoId;

        return (
          <div
            key={item.video_id}
            className={`group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900 ${
              isSelected ? "border-indigo-400 ring-2 ring-indigo-500/20" : "border-slate-200 dark:border-slate-700"
            }`}
          >
            {/* Thumbnail */}
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block aspect-video w-full overflow-hidden"
            >
              <FallbackImage
                src={item.thumbnail_url}
                className="h-full w-full"
                imgClassName="h-full w-full object-cover transition-transform group-hover:scale-105"
              />

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
                <h3 className="line-clamp-2 min-w-0 flex-1 break-words text-sm font-semibold leading-snug text-slate-800 group-hover:text-indigo-600 transition-colors dark:text-slate-200">
                  {decodeHtmlEntities(item.title)}
                </h3>
                <ExternalLink size={11} className="mt-0.5 shrink-0 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity dark:text-slate-500" />
              </a>

              <p className="mt-1.5 truncate text-xs text-slate-500 dark:text-slate-400">{decodeHtmlEntities(item.channel)}</p>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <Eye size={13} className="text-slate-400 dark:text-slate-500" />
                  {formatCompact(item.view_count)}
                </div>
                {date && (
                  <span title={formatAbsoluteDate(item.published_at)} className="text-[11px] text-slate-400 dark:text-slate-500">
                    {date}
                  </span>
                )}
              </div>

              <SentimentBar summary={item.sentiment_summary} />

              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
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
