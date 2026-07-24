"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { formatCompactNumber } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

import type { PlatformSnapshotConfig } from "../config/platforms";
import { usePlatformSnapshot } from "../hooks/usePlatformSnapshot";
import SnapshotSparkline from "./SnapshotSparkline";
import TopPostsTable from "./TopPostsTable";

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-slate-400 dark:text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}

export default function PlatformSnapshotCard({ config }: { config: PlatformSnapshotConfig }) {
  const { t } = useTranslation();
  const { data, isLoading, isError } = usePlatformSnapshot(config);
  const s = t.socialSnapshot;
  const { Icon } = config;

  const primaryLabel = config.primaryMetric === "views" ? s.totalViews : s.totalLikes;
  const metricLabel = config.primaryMetric === "views" ? s.metricViews : s.metricLikes;

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800" />;
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-400 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500">
        {s.error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:grid-cols-[10rem_1fr] xl:grid-cols-[10rem_1fr_20rem]">
      <div className="flex flex-row items-center gap-3 md:flex-col md:items-start md:justify-between">
        <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-4">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-xl text-white"
            style={{ backgroundColor: config.accentColor }}
          >
            <Icon size={22} />
          </span>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {t.sidebar[config.key]}
          </p>
        </div>

        <Link
          href={config.href}
          className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
        >
          {s.viewAll}
          <ArrowUpRight size={12} />
        </Link>
      </div>

      <div className="flex flex-col justify-between gap-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatTile label={s.totalPosts} value={formatCompactNumber(data.totalPosts)} />
          <StatTile label={primaryLabel} value={formatCompactNumber(data.totalPrimaryMetric)} />
          <StatTile label={s.totalComments} value={formatCompactNumber(data.totalComments)} />
          <StatTile
            label={s.avgTrendScore}
            value={data.avgTrendScore != null ? data.avgTrendScore.toFixed(1) : "–"}
          />
        </div>

        <SnapshotSparkline data={data.trend} color={config.accentColor} />
      </div>

      <div className="border-t border-slate-100 pt-4 dark:border-slate-800 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0">
        <p className="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
          {s.topPostsTitle.replace("{metric}", metricLabel)}
        </p>
        <TopPostsTable
          posts={data.topPosts}
          metricLabel={metricLabel}
          color={config.accentColor}
          emptyLabel={s.emptyTopPosts}
        />
      </div>
    </div>
  );
}
