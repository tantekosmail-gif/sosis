"use client";

import Link from "next/link";
import { Crown } from "lucide-react";

import type { Topic } from "@/features/topic/hooks/useTopics";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const RANK_BADGE_COLOR = [
  "bg-white/20 text-white", // #1, dipakai di dalam hero card (background sudah gelap)
  "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400",
  "bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400",
  "bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400",
  "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
];

// Ranking murni dari `totalPosts` yang sudah ada di list topik (tanpa call API
// tambahan per topik) -- beda dari TopicGrowthSection yang butuh getTopicMetrics
// per topik untuk hitung growth%. Di sini cukup "topik paling ramai".
export default function TopTopicsLeaderboard({ topics }: { topics: Topic[] }) {
  const { t } = useTranslation();
  const labels = t.topics.topTopics;

  const ranked = [...topics]
    .filter((topic) => (topic.totalPosts ?? 0) > 0)
    .sort((a, b) => (b.totalPosts ?? 0) - (a.totalPosts ?? 0))
    .slice(0, 5);

  if (ranked.length === 0) return null;

  const [top1, ...rest] = ranked;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-5">
      <div className="mb-1 flex items-center gap-2">
        <Crown size={16} className="text-amber-500" />
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">{labels.title}</h2>
      </div>
      <p className="mb-4 text-xs text-slate-400 dark:text-slate-500">{labels.desc}</p>

      <div className="grid gap-4 lg:grid-cols-3">
        <Link
          href={`/topics/${top1.id}`}
          className="group flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-5 shadow-md shadow-indigo-500/30 transition hover:shadow-lg lg:col-span-1"
        >
          <div className="flex items-center gap-2">
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${RANK_BADGE_COLOR[0]}`}>
              {labels.rankPrefix}1
            </span>
            <Crown size={16} className="text-amber-300" />
          </div>
          <div>
            <p className="font-semibold leading-snug text-white group-hover:underline">{top1.name}</p>
            <p className="mt-1 text-sm text-indigo-100">
              {(top1.totalPosts ?? 0).toLocaleString("id-ID")} {labels.mentionsUnit}
            </p>
          </div>
        </Link>

        <div className="flex flex-col gap-2 lg:col-span-2">
          {rest.map((topic, i) => (
            <Link
              key={topic.id}
              href={`/topics/${topic.id}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 dark:border-slate-800 px-3.5 py-2.5 transition hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${RANK_BADGE_COLOR[i + 1]}`}
                >
                  {labels.rankPrefix}
                  {i + 2}
                </span>
                <span className="truncate text-sm font-medium text-slate-700 dark:text-slate-300">{topic.name}</span>
              </div>
              <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
                {(topic.totalPosts ?? 0).toLocaleString("id-ID")} {labels.mentionsUnit}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
