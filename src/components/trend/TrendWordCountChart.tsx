"use client";

import { Hash } from "lucide-react";

import type { TrendTimelineData } from "@/features/trends/types/timeline.types";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

interface Props {
  data: TrendTimelineData;
}

export default function TrendWordCountChart({ data }: Props) {
  const { t } = useTranslation();
  const ranked = data.keywords
    .map((keyword) => ({ keyword, total: data.series[keyword]?.total_mentions ?? 0 }))
    .sort((a, b) => b.total - a.total);

  const max = ranked[0]?.total || 1;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/40">
          <Hash size={17} className="text-amber-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t.overviewWidgets.trendWordCount.title}</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">{t.overviewWidgets.trendWordCount.desc}</p>
        </div>
      </div>

      <div className="flex-1 p-6">
        {ranked.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">{t.overviewWidgets.trendWordCount.empty}</p>
        ) : (
          <div className="space-y-4">
            {ranked.map((item) => (
              <div key={item.keyword} className="flex items-center gap-3">
                <span className="w-20 shrink-0 truncate font-mono text-sm text-slate-700 dark:text-slate-300">{item.keyword}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-slate-300"
                    style={{ width: `${Math.max((item.total / max) * 100, 4)}%` }}
                  />
                </div>
                <span className="w-12 shrink-0 text-right font-mono text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {item.total.toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
