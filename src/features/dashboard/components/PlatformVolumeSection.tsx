"use client";

import { usePlatformOverviewData } from "../hooks/usePlatformOverviewData";
import PlatformVolumeChart from "./PlatformVolumeChart";

export default function PlatformVolumeSection() {
  const { data: cards, isLoading } = usePlatformOverviewData();

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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Volume Post & Komentar per Platform</h2>
        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
          <span className="font-semibold text-slate-700 dark:text-slate-300">{totals.posts.toLocaleString("id-ID")}</span> post ·{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-300">{totals.comments.toLocaleString("id-ID")}</span> komentar
        </p>
      </div>

      <PlatformVolumeChart data={cards} />
    </div>
  );
}
