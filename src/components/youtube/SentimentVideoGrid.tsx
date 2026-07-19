"use client";

import { ExternalLink, Eye, MessageSquare } from "lucide-react";

import SentimentBreakdownBar from "@/components/common/SentimentBreakdownBar";
import FallbackImage from "@/components/common/FallbackImage";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { DashboardPost } from "@/types/dashboard.type";

function formatCompact(n: number) {
  if (!n) return "0";
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function SentimentVideoGrid({ data }: { data: DashboardPost[] }) {
  const { t } = useTranslation();

  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-500">
        {t.youtubeVideoGrid.noData}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((item) => {
        const date = formatDate(item.publishedAt);

        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
          >
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="group relative block aspect-video w-full overflow-hidden">
              <FallbackImage
                src={item.thumbnail}
                className="h-full w-full"
                imgClassName="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <ExternalLink size={12} />
              </span>
            </a>

            <div className="p-4">
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="group">
                <h3 className="line-clamp-2 min-w-0 break-words text-sm font-semibold leading-snug text-slate-800 transition-colors group-hover:text-indigo-600 dark:text-slate-200">
                  {item.title}
                </h3>
              </a>
              <p className="mt-1.5 truncate text-xs text-slate-500 dark:text-slate-400">{item.author}</p>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-3 font-semibold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1">
                    <Eye size={13} className="text-slate-400 dark:text-slate-500" />
                    {formatCompact(item.views)}
                  </span>
                  {item.comments > 0 && (
                    <span className="flex items-center gap-1">
                      <MessageSquare size={12} className="text-slate-400 dark:text-slate-500" />
                      {item.comments} {t.youtubeVideoGrid.commentsUnit}
                    </span>
                  )}
                </div>
                {date && <span className="text-[11px] text-slate-400 dark:text-slate-500">{date}</span>}
              </div>

              <SentimentBreakdownBar summary={item.sentimentBreakdown} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
