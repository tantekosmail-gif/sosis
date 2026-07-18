"use client";

import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { FaFacebook, FaInstagram, FaTiktok, FaXTwitter, FaYoutube } from "react-icons/fa6";

import type { EngagementPlatform, EngagementSummary } from "@/features/engagement/types/engagement.types";
import { PLATFORM_COLOR, PLATFORM_LABEL } from "@/features/engagement/lib/colors";
import { formatCompact } from "@/features/engagement/lib/format";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
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
// tayangan utk 2 platform ini (lihat AGENTS.md).
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

function MentionGrowthBadge({ value }: { value: number | null }) {
  if (value === null) {
    return <span className="text-xs text-slate-300 dark:text-slate-600">—</span>;
  }
  const neutral = Math.abs(value) < 1;
  const positive = value >= 1;
  const color = neutral
    ? "text-slate-400 dark:text-slate-500"
    : positive
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-red-600 dark:text-red-400";

  return (
    <span className={`text-xs font-semibold tabular-nums ${color}`}>
      {positive && !neutral ? "+" : ""}
      {value.toFixed(1)}%
    </span>
  );
}

interface Props {
  summaries: Partial<Record<EngagementPlatform, EngagementSummary>>;
  errors: Partial<Record<EngagementPlatform, string>>;
  platforms: EngagementPlatform[];
}

export default function EngagementSummaryTable({ summaries, errors, platforms }: Props) {
  const { t } = useTranslation();
  const { show } = useMetricSource();

  function sourceCell(metric: MetricKey, platform: EngagementPlatform, value: string, children: ReactNode) {
    return (
      <button
        type="button"
        onClick={() => show({ metric, platform, value })}
        title={SOURCE_HINT}
        className="w-full cursor-pointer text-inherit hover:text-indigo-600 dark:hover:text-indigo-400 text-right"
      >
        {children}
      </button>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400 dark:bg-slate-950 dark:text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left">{t.engagementTable.platform}</th>
              <th className="px-4 py-3 text-right">{t.engagementTable.mentions}</th>
              <th className="px-4 py-3 text-right">{t.engagementTable.reach}</th>
              <th className="px-4 py-3 text-right">{t.engagementTable.exposure}</th>
              <th className="px-4 py-3 text-right">{t.engagementTable.engagement}</th>
              <th className="px-4 py-3 text-right">{t.engagementTable.mentionGrowth}</th>
              <th className="px-4 py-3 text-left">{t.engagementTable.sentiment}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {platforms.map((platform) => {
              const summary = summaries[platform];
              const error = errors[platform];
              const Icon = PLATFORM_ICON[platform];
              const color = PLATFORM_COLOR[platform];

              return (
                <tr key={platform}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${color}1a`, color }}
                      >
                        <Icon size={11} />
                      </span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{PLATFORM_LABEL[platform]}</span>
                    </div>
                  </td>

                  {!summary || error ? (
                    <td colSpan={6} className="px-4 py-3 text-xs text-slate-400 dark:text-slate-500">
                      {error ?? t.engagementTable.noData}
                    </td>
                  ) : (
                    <>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-700 dark:text-slate-300">
                        {sourceCell("mentions", platform, summary.mentions.toLocaleString("id-ID"), summary.mentions.toLocaleString("id-ID"))}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-700 dark:text-slate-300">
                        {sourceCell("reach", platform, formatCompact(summary.reach), formatCompact(summary.reach))}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-700 dark:text-slate-300">
                        {(() => {
                          const value =
                            EXPOSURE_UNAVAILABLE.includes(platform) && summary.exposure === 0
                              ? t.engagementTable.notAvailable
                              : formatCompact(summary.exposure);
                          return sourceCell("exposure", platform, value, value);
                        })()}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                        <button
                          type="button"
                          onClick={() =>
                            show({
                              metric: "engagement",
                              platform,
                              value: formatCompact(summary.engagement),
                              breakdown: summary.breakdown,
                              rawTotal: summary.engagement,
                            })
                          }
                          title={SOURCE_HINT}
                          className="w-full cursor-pointer text-right text-inherit hover:text-indigo-600 dark:hover:text-indigo-400"
                        >
                          {formatCompact(summary.engagement)}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {sourceCell(
                          "mentionGrowth",
                          platform,
                          summary.mentionGrowth === null ? "—" : `${summary.mentionGrowth.toFixed(1)}%`,
                          <MentionGrowthBadge value={summary.mentionGrowth} />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => show({ metric: "sentiment", platform, value: `${summary.sentimentScore.toFixed(1)}%` })}
                          title={SOURCE_HINT}
                          className="cursor-pointer"
                        >
                          <SentimentBadge value={summary.sentimentScore} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
