"use client";

import { ExternalLink, Eye, Flame, MessageCircle, ThumbsUp } from "lucide-react";

import type { VideoMetadataItem } from "@/features/youtube/hooks/useVideoSearch";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { decodeHtmlEntities } from "@/lib/decodeHtmlEntities";

function formatRelativeTime(dateStr?: string) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return null;

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60_000);

  if (diffMinutes < 1) return "Baru saja";
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} jam lalu`;

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays} hari lalu`;
}

function formatCompact(n: number) {
  if (!n) return "0";
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

export default function VideoSearchGrid({
  items,
  onSelectVideo,
  selectedVideoId,
}: {
  items: VideoMetadataItem[];
  onSelectVideo: (id: string) => void;
  selectedVideoId?: string | null;
}) {
  const { t } = useTranslation();

  if (!items || items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-500">
        {t.youtubeSearchTab.noResults}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {items.map((item) => {
        const relativeTime = formatRelativeTime(item.published_at);
        const trendScore = item.scores.trend_score ?? 0;
        const isSelected = item.id === selectedVideoId;

        return (
          <div
            key={item.id}
            className={`group flex items-start justify-between gap-2 rounded-lg px-2.5 py-2 transition-colors ${
              isSelected ? "bg-indigo-50 dark:bg-indigo-950/30" : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
            }`}
          >
            <button
              type="button"
              onClick={() => onSelectVideo(item.id)}
              className="min-w-0 flex-1 text-left"
            >
              {trendScore > 0 && (
                <span className="mb-1 inline-flex w-fit items-center gap-1 rounded-full bg-orange-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  <Flame size={10} /> {trendScore.toFixed(1)}
                </span>
              )}
              <h3
                className={`line-clamp-1 min-w-0 break-words text-sm font-semibold leading-snug transition-colors ${
                  isSelected ? "text-indigo-700 dark:text-indigo-400" : "text-slate-800 group-hover:text-indigo-600 dark:text-slate-200"
                }`}
              >
                {decodeHtmlEntities(item.title)}
              </h3>
              <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{decodeHtmlEntities(item.author)}</p>

              <div className="mt-1 flex items-center gap-2.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1">
                  <Eye size={11} className="text-slate-400 dark:text-slate-500" />
                  {formatCompact(item.metrics.views)}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp size={11} className="text-slate-400 dark:text-slate-500" />
                  {formatCompact(item.metrics.likes)}
                </span>
                {item.saved_comment_count > 0 && (
                  <span className="flex items-center gap-1">
                    <MessageCircle size={11} className="text-slate-400 dark:text-slate-500" />
                    {formatCompact(item.saved_comment_count)}
                  </span>
                )}
                {relativeTime && <span className="font-normal text-slate-400 dark:text-slate-500">{relativeTime}</span>}
              </div>
            </button>

            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              title={t.videoFilterBar.openOnYoutube}
              className="shrink-0 rounded-lg p-1 text-slate-300 transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-600 dark:hover:bg-slate-800"
            >
              <ExternalLink size={13} />
            </a>
          </div>
        );
      })}
    </div>
  );
}
