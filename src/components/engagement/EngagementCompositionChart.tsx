"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { ENGAGEMENT_PLATFORMS } from "@/features/engagement/hooks/useEngagementDashboard";
import type { EngagementPlatform, EngagementSummary } from "@/features/engagement/types/engagement.types";
import { BREAKDOWN_COLOR, BREAKDOWN_KEYS, BREAKDOWN_LABEL, PLATFORM_LABEL } from "@/features/engagement/lib/colors";
import { formatCompact } from "@/features/engagement/lib/format";
import { useMetricSource } from "./MetricSource";

const SOURCE_HINT = "Klik untuk lihat sumber data";

interface Props {
  summaries: Partial<Record<EngagementPlatform, EngagementSummary>>;
}

function CompositionTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const row = payload[0]?.payload;
  if (!row) return null;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 shadow-lg text-xs min-w-40">
      <p className="mb-1.5 font-semibold text-slate-700 dark:text-slate-300">{row.label}</p>
      {BREAKDOWN_KEYS.map((key) => (
        <div key={key} className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <span className="h-2 w-2 rounded-full" style={{ background: BREAKDOWN_COLOR[key] }} />
            {BREAKDOWN_LABEL[key]}
          </span>
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {formatCompact(row[`${key}Value`])} ({row[key].toFixed(1)}%)
          </span>
        </div>
      ))}
    </div>
  );
}

export default function EngagementCompositionChart({ summaries }: Props) {
  const { show } = useMetricSource();
  const rows = ENGAGEMENT_PLATFORMS.filter((p) => summaries[p]).map((platform) => {
    const summary = summaries[platform]!;
    const total = BREAKDOWN_KEYS.reduce((sum, key) => sum + summary.breakdown[key], 0) || 1;
    const row: Record<string, number | string> = { platform, label: PLATFORM_LABEL[platform], total: summary.engagement };
    for (const key of BREAKDOWN_KEYS) {
      row[key] = (summary.breakdown[key] / total) * 100;
      row[`${key}Value`] = summary.breakdown[key];
    }
    return row;
  });

  if (rows.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="mb-1 flex items-center justify-between">
        <button
          type="button"
          onClick={() => show({ metric: "breakdown" })}
          title={SOURCE_HINT}
          className="text-left font-semibold text-slate-900 underline decoration-slate-200 decoration-dotted underline-offset-4 transition hover:decoration-indigo-400 dark:text-slate-100 dark:decoration-slate-700"
        >
          Komposisi Engagement per Platform
        </button>
      </div>
      <button
        type="button"
        onClick={() => show({ metric: "breakdown" })}
        title={SOURCE_HINT}
        className="mb-4 block text-left text-xs text-slate-400 hover:text-indigo-500 dark:text-slate-500"
      >
        Persentase dari total engagement masing-masing platform sendiri (bukan skala gabungan) — angka asli ada di tooltip.
      </button>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        {BREAKDOWN_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => show({ metric: "breakdown" })}
            title={SOURCE_HINT}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: BREAKDOWN_COLOR[key] }} />
            {BREAKDOWN_LABEL[key]}
          </button>
        ))}
      </div>

      <div style={{ height: rows.length * 56 }} className="cursor-pointer" title={SOURCE_HINT}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={rows}
            layout="vertical"
            margin={{ top: 4, right: 24, left: 4, bottom: 4 }}
            barSize={22}
            barGap={2}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="label" width={72} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CompositionTooltip />} cursor={{ fill: "#f8fafc" }} />
            {BREAKDOWN_KEYS.map((key, i) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="composition"
                fill={BREAKDOWN_COLOR[key]}
                radius={i === BREAKDOWN_KEYS.length - 1 ? [0, 4, 4, 0] : i === 0 ? [4, 0, 0, 4] : 0}
                cursor="pointer"
                onClick={(data: any) => {
                  const platform = data?.payload?.platform as EngagementPlatform | undefined;
                  const summary = platform ? summaries[platform] : undefined;
                  show({
                    metric: "breakdown",
                    platform,
                    value: summary ? formatCompact(summary.engagement) : undefined,
                    breakdown: summary?.breakdown,
                    rawTotal: summary?.engagement,
                    sortBy: key,
                    sortByLabel: BREAKDOWN_LABEL[key],
                  });
                }}
              >
                {rows.map((_, idx) => (
                  <Cell key={idx} stroke="#fff" strokeWidth={1} />
                ))}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
