"use client";

import type { TrendingComment } from "@/features/instagram/types/trending.types";

const SENTIMENT_STYLE: Record<string, { pill: string; dot: string }> = {
  positif: { pill: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  negatif: { pill: "bg-red-50 dark:bg-red-950/40 text-red-700 border-red-200",             dot: "bg-red-500" },
  netral:  { pill: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 border-amber-200",       dot: "bg-amber-400" },
};

export default function TrendingCommentsList({ data }: { data: TrendingComment[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 py-12 text-center text-sm text-slate-400 dark:text-slate-500">
        Tidak ada komentar
      </div>
    );
  }

  return (
    <ul className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      {data.map((comment, idx) => {
        const sentiment = comment.sentiment?.toLowerCase() ?? "netral";
        const sentimentCfg = SENTIMENT_STYLE[sentiment] ?? SENTIMENT_STYLE.netral;

        return (
          <li key={comment.id ?? `${comment.author}-${idx}`} className="px-5 py-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{comment.author}</span>
              <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${sentimentCfg.pill}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${sentimentCfg.dot}`} />
                {comment.sentiment} ({comment.score.toFixed(2)})
              </span>
            </div>

            <p className="mt-1.5 break-words text-sm leading-snug text-slate-600 dark:text-slate-400">{comment.content}</p>
          </li>
        );
      })}
    </ul>
  );
}
