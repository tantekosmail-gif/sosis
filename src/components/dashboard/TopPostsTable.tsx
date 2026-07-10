"use client";

import { ExternalLink, Eye, MessageCircle, Calendar } from "lucide-react";

interface Post {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  publishedAt?: string;
  views: number;
  likes: number;
  comments: number;
  sentiment: string;
  url: string;
}

const SENTIMENT_STYLE: Record<string, { pill: string; dot: string }> = {
  positive: { pill: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  negative: { pill: "bg-red-50 dark:bg-red-950/40 text-red-700 border-red-200",            dot: "bg-red-500" },
  neutral:  { pill: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 border-amber-200",      dot: "bg-amber-400" },
};

const SENTIMENT_LABEL: Record<string, string> = {
  positive: "Positif",
  negative: "Negatif",
  neutral:  "Netral",
};

const RANK_STYLE: Record<number, string> = {
  0: "bg-amber-400 text-white",
  1: "bg-slate-400 text-white",
  2: "bg-orange-400 text-white",
};

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return null;
  }
}

function formatCompact(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

export default function TopPostsTable({ data }: { data: Post[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Top Videos</h2>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">10 konten terpopuler berdasarkan views</p>
        </div>
        <div className="py-16 text-center text-slate-400 dark:text-slate-500 text-sm">Tidak ada data</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">Top Videos</h2>
        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">10 konten terpopuler berdasarkan views</p>
      </div>

      {/* List */}
      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {data.map((item, idx) => {
          const sentiment = item.sentiment?.toLowerCase() ?? "neutral";
          const sentimentCfg = SENTIMENT_STYLE[sentiment] ?? SENTIMENT_STYLE.neutral;
          const date = formatDate(item.publishedAt);

          return (
            <li key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/70 transition-colors">
              {/* Rank */}
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${RANK_STYLE[idx] ?? "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}>
                {idx + 1}
              </span>

              {/* Thumbnail */}
              <div className="h-16 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="h-full w-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-slate-300 text-xs">No img</div>
                )}
              </div>

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
                    <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                      <Calendar size={10} />
                      {date}
                    </span>
                  )}

                  <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${sentimentCfg.pill}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${sentimentCfg.dot}`} />
                    {SENTIMENT_LABEL[sentiment] ?? sentiment}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="shrink-0 hidden sm:flex flex-col items-end gap-1.5">
                <div className="flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <Eye size={13} className="text-slate-400 dark:text-slate-500" />
                  {formatCompact(item.views)}
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <MessageCircle size={12} className="text-slate-400 dark:text-slate-500" />
                  {formatCompact(item.comments)}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
