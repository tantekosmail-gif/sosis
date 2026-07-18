"use client";

import type { IconType } from "react-icons";
import { FaFacebook, FaInstagram, FaTiktok, FaXTwitter, FaYoutube } from "react-icons/fa6";

import type { EngagementPlatform, EngagementSummary } from "@/features/engagement/types/engagement.types";
import { BREAKDOWN_COLOR, BREAKDOWN_KEYS, PLATFORM_COLOR, PLATFORM_LABEL } from "@/features/engagement/lib/colors";
import { formatCompact } from "@/features/engagement/lib/format";
import { useMetricSource, type MetricKey } from "./MetricSource";

const SOURCE_HINT = "Klik untuk lihat sumber data";

const PLATFORM_ICON: Record<EngagementPlatform, IconType> = {
  youtube: FaYoutube,
  tiktok: FaTiktok,
  twitter: FaXTwitter,
  facebook: FaFacebook,
  instagram: FaInstagram,
};

// exposure = 0 di Facebook & Instagram bukan bug — provider tidak pernah kirim data
// tayangan utk 2 platform ini (lihat AGENTS.md). Tampilkan sebagai "Tidak tersedia".
const EXPOSURE_UNAVAILABLE: EngagementPlatform[] = ["facebook", "instagram"];

function SentimentBadge({ value }: { value: number }) {
  const neutral = Math.abs(value) < 1;
  const positive = value >= 1;
  const color = neutral
    ? "text-slate-400 dark:text-slate-500"
    : positive
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-red-600 dark:text-red-400";
  const glyph = neutral ? "•" : positive ? "▲" : "▼";
  const label = neutral ? "Netral" : positive ? "Positif" : "Negatif";

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold tabular-nums ${color}`}>
      <span aria-hidden="true">{glyph}</span>
      {label} {positive && !neutral ? "+" : ""}
      {value.toFixed(1)}%
    </span>
  );
}

interface Props {
  summary?: EngagementSummary;
  error?: string;
  loading?: boolean;
}

export default function EngagementSummaryCard({ summary, error, loading }: Props) {
  const platform = summary?.platform;
  const { show } = useMetricSource();

  function showSource(metric: MetricKey, value: string) {
    if (!platform || !summary) return;
    const withBreakdown = metric === "engagement" || metric === "breakdown";
    show({
      metric,
      platform,
      value,
      breakdown: withBreakdown ? summary.breakdown : undefined,
      rawTotal: withBreakdown ? summary.engagement : undefined,
    });
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm animate-pulse">
        <div className="h-4 w-20 rounded bg-slate-100 dark:bg-slate-800" />
        <div className="mt-4 h-8 w-28 rounded bg-slate-100 dark:bg-slate-800" />
        <div className="mt-4 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800" />
        <div className="mt-4 space-y-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-3 w-full rounded bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  if (!summary || error) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm">
        <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">
          {error ?? "Data tidak tersedia"}
        </p>
      </div>
    );
  }

  const Icon = PLATFORM_ICON[summary.platform];
  const color = PLATFORM_COLOR[summary.platform];
  const total = BREAKDOWN_KEYS.reduce((sum, key) => sum + summary.breakdown[key], 0) || 1;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-center gap-2">
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: `${color}1a`, color }}
        >
          <Icon size={13} />
        </span>
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{PLATFORM_LABEL[summary.platform]}</span>
      </div>

      <button
        type="button"
        onClick={() => showSource("engagement", formatCompact(summary.engagement))}
        title={SOURCE_HINT}
        className="mt-4 block text-left"
      >
        <p className="text-3xl font-bold tabular-nums text-slate-900 underline decoration-slate-200 decoration-dotted underline-offset-4 transition hover:decoration-indigo-400 dark:text-slate-100 dark:decoration-slate-700">
          {formatCompact(summary.engagement)}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">Total Engagement</p>
      </button>

      <button
        type="button"
        onClick={() => showSource("breakdown", formatCompact(summary.engagement))}
        title={SOURCE_HINT}
        className="mt-3 flex h-1.5 w-full cursor-pointer overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
      >
        {BREAKDOWN_KEYS.map((key) => {
          const pct = (summary.breakdown[key] / total) * 100;
          if (pct <= 0) return null;
          return (
            <span
              key={key}
              style={{ width: `${pct}%`, backgroundColor: BREAKDOWN_COLOR[key] }}
              title={`${key}: ${summary.breakdown[key].toLocaleString("id-ID")}`}
            />
          );
        })}
      </button>

      <div className="mt-4 space-y-1.5 text-xs">
        {(
          [
            { metric: "mentions" as const, label: "Mentions", value: summary.mentions.toLocaleString("id-ID") },
            { metric: "reach" as const, label: "Reach", value: summary.reach.toLocaleString("id-ID") },
            {
              metric: "exposure" as const,
              label: "Exposure",
              value:
                platform && EXPOSURE_UNAVAILABLE.includes(platform) && summary.exposure === 0
                  ? "Tidak tersedia"
                  : formatCompact(summary.exposure),
            },
          ]
        ).map(({ metric, label, value }) => (
          <button
            key={metric}
            type="button"
            onClick={() => showSource(metric, value)}
            title={SOURCE_HINT}
            className="group flex w-full items-center justify-between rounded-md text-left"
          >
            <span className="text-slate-400 group-hover:text-indigo-500 dark:text-slate-500">{label}</span>
            <span className="font-semibold tabular-nums text-slate-700 dark:text-slate-300">{value}</span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => showSource("sentiment", `${summary.sentimentScore.toFixed(1)}%`)}
          title={SOURCE_HINT}
          className="group flex w-full items-center justify-between rounded-md text-left"
        >
          <span className="text-slate-400 group-hover:text-indigo-500 dark:text-slate-500">Sentimen</span>
          <SentimentBadge value={summary.sentimentScore} />
        </button>
      </div>
    </div>
  );
}
