"use client";

import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { ExternalLink, Eye, Calendar } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import FallbackImage from "@/components/common/FallbackImage";

interface Post {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  publishedAt?: string;
  views: number;
  likes: number;
  url: string;
}

const RANK_STYLE: Record<number, string> = {
  0: "bg-amber-400 text-white",
  1: "bg-slate-400 text-white",
  2: "bg-orange-400 text-white",
};

// Label tanggal ditampilkan relatif ("1 hari yang lalu" / "1 day ago");
// tanggal absolutnya tetap tersedia lewat tooltip (atribut title).
function formatRelativeDate(dateStr: string | undefined, language: string) {
  const date = dateStr ? new Date(dateStr) : null;
  if (!date || isNaN(date.getTime())) return null;
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: language === "id" ? idLocale : undefined,
  });
}

function formatAbsoluteDate(dateStr: string | undefined) {
  const date = dateStr ? new Date(dateStr) : null;
  if (!date || isNaN(date.getTime())) return undefined;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function formatCompact(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

export default function TopPostsTable({ data }: { data: Post[] }) {
  const { t, language } = useTranslation();

  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t.topPostsTable.title}</h2>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{t.topPostsTable.subtitle}</p>
        </div>
        <div className="py-16 text-center text-slate-400 dark:text-slate-500 text-sm">{t.topPostsTable.noData}</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t.topPostsTable.title}</h2>
        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{t.topPostsTable.subtitle}</p>
      </div>

      {/* List */}
      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {data.map((item, idx) => {
          const date = formatRelativeDate(item.publishedAt, language);

          return (
            <li key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors">
              {/* Rank */}
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${RANK_STYLE[idx] ?? "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}>
                {idx + 1}
              </span>

              {/* Thumbnail */}
              <FallbackImage src={item.thumbnail} className="h-16 w-28 shrink-0 rounded-xl" illustrationClassName="h-2/5 w-2/5 max-h-8 max-w-8" />

              {/* Main content */}
              <div className="flex-1 min-w-0">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-1"
                >
                  <span className="line-clamp-2 text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 transition-colors leading-snug">
                    {item.title}
                  </span>
                  <ExternalLink size={11} className="mt-0.5 shrink-0 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>

                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[160px]">{item.author}</span>

                  {date && (
                    <span
                      title={formatAbsoluteDate(item.publishedAt)}
                      className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500"
                    >
                      <Calendar size={10} />
                      {date}
                    </span>
                  )}

                </div>
              </div>

              {/* Stats */}
              <div className="shrink-0 hidden sm:flex flex-col items-end gap-1.5">
                <div className="flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <Eye size={13} className="text-slate-400 dark:text-slate-500" />
                  {formatCompact(item.views)}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
