"use client";

import { ExternalLink, Rss } from "lucide-react";

import type { TrendFeedData } from "@/features/trends/types/feed.types";
import { getPlatformIcon } from "@/lib/platformIcons";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

interface Props {
  keywords: string[];
  selectedKeyword: string;
  onSelectKeyword: (keyword: string) => void;
  data: TrendFeedData;
}

export default function TrendFeedChart({ keywords, selectedKeyword, onSelectKeyword, data }: Props) {
  const items = data.items;
  const { t, language } = useTranslation();

  const SOURCE_LABEL: Record<string, string> = {
    post: t.overviewWidgets.feedPostKomentar.sourcePost,
    comment: t.overviewWidgets.feedPostKomentar.sourceComment,
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40">
          <Rss size={17} className="text-indigo-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t.overviewWidgets.feedPostKomentar.title}</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">{t.overviewWidgets.feedPostKomentar.desc}</p>
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
          {t.overviewWidgets.feedPostKomentar.empty.replace("{keyword}", data.keyword)}
        </p>
      ) : (
        <ul className="max-h-[32rem] divide-y divide-slate-100 dark:divide-slate-800 overflow-y-auto">
          {items.map((item) => {
            const Icon = getPlatformIcon(item.platform);

            return (
              <li key={item.id} className="px-6 py-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/40">
                      <Icon size={12} className="text-indigo-600" />
                    </span>
                    <span className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">{item.author}</span>
                    <span className="shrink-0 rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium capitalize text-slate-500 dark:text-slate-400">
                      {SOURCE_LABEL[item.source_type] ?? item.source_type}
                    </span>
                  </div>
                  <span className="shrink-0 text-[11px] text-slate-400 dark:text-slate-500">{formatRelativeTime(item.published_at, language)}</span>
                </div>

                <p className="mt-1.5 line-clamp-3 whitespace-pre-line break-words text-sm leading-snug text-slate-600 dark:text-slate-400">
                  {item.content}
                </p>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  {t.overviewWidgets.feedPostKomentar.openPost} <ExternalLink size={11} />
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
