"use client";

import { usePlatformOverviewData } from "../hooks/usePlatformOverviewData";
import PlatformVolumeChart from "./PlatformVolumeChart";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function PlatformVolumeSection() {
  const { data: cards, isLoading } = usePlatformOverviewData();
  const { t } = useTranslation();

  if (isLoading) {
    return <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800" />;
  }

  if (!cards || cards.length === 0) return null;

  const totals = cards.reduce(
    (acc, c) => ({
      posts: acc.posts + c.totalPosts,
      comments: acc.comments + c.totalComments,
    }),
    { posts: 0, comments: 0 }
  );

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t.overviewWidgets.platformVolume.title}</h2>
        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
          {t.overviewWidgets.platformVolume.totalsLine
            .replace("{posts}", totals.posts.toLocaleString("id-ID"))
            .replace("{comments}", totals.comments.toLocaleString("id-ID"))}
        </p>
      </div>

      <PlatformVolumeChart data={cards} />
    </div>
  );
}
