"use client";

import { ExternalLink, Eye, MessageCircle, ThumbsUp } from "lucide-react";

import type { SearchedVideoItem } from "@/features/youtube/hooks/useVideoSearch";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return null;
  }
}

function formatCompact(n: number) {
  if (!n) return "0";
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

export default function VideoSearchGrid({ items }: { items: SearchedVideoItem[] }) {
  const { t } = useTranslation();

  if (!items || items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-500">
        {t.youtubeSearchTab.noResults}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => {
        const date = formatDate(item.published_at);

        return (
          <a
            key={item.video_id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              {item.thumbnail_url ? (
                <img
                  src={item.thumbnail_url}
                  alt=""
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-slate-300">No thumbnail</div>
              )}
              <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <ExternalLink size={12} />
              </span>
            </div>

            <div className="p-4">
              <h3 className="line-clamp-2 min-w-0 break-words text-sm font-semibold leading-snug text-slate-800 transition-colors group-hover:text-indigo-600 dark:text-slate-200">
                {item.title}
              </h3>
              <p className="mt-1.5 truncate text-xs text-slate-500 dark:text-slate-400">{item.channel}</p>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1">
                    <Eye size={13} className="text-slate-400 dark:text-slate-500" />
                    {formatCompact(item.view_count)}
                  </span>
                  {item.like_count > 0 && (
                    <span className="flex items-center gap-1">
                      <ThumbsUp size={12} className="text-slate-400 dark:text-slate-500" />
                      {formatCompact(item.like_count)}
                    </span>
                  )}
                </div>
                {date && <span className="text-[11px] text-slate-400 dark:text-slate-500">{date}</span>}
              </div>

              {item.comment_count > 0 && (
                <div className="mt-3 flex items-center gap-1 border-t border-slate-100 pt-3 text-[11px] text-slate-400 dark:border-slate-800 dark:text-slate-500">
                  <MessageCircle size={12} />
                  {item.comment_count} komentar
                </div>
              )}
            </div>
          </a>
        );
      })}
    </div>
  );
}
