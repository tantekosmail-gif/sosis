"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, LabelList } from "recharts";
import { SlidersHorizontal } from "lucide-react";

import type { TrendTimelineData } from "@/features/trends/types/timeline.types";

// Ramp sequential satu hue (indigo, brand accent app ini) — magnitude rendah
// = pucat, tinggi = pekat. Dipakai sama di light & dark karena tiap bar sudah
// punya label angka langsung di ujungnya (relief kontras), jadi tidak perlu
// ramp terpisah per mode.
const SEQUENTIAL_RAMP = ["#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1", "#4f46e5"];
const ACCENT_COLOR = SEQUENTIAL_RAMP[3];
const GRIDLINE_COLOR = "rgba(148, 163, 184, 0.15)";

function colorForValue(value: number, maxValue: number) {
  if (maxValue <= 0) return SEQUENTIAL_RAMP[0];
  const ratio = value / maxValue;
  const idx = Math.min(SEQUENTIAL_RAMP.length - 1, Math.floor(ratio * SEQUENTIAL_RAMP.length));
  return SEQUENTIAL_RAMP[idx];
}

function truncate(label: string, max = 32) {
  const clean = label.trim();
  return clean.length > max ? `${clean.slice(0, max).trimEnd()}…` : clean;
}

function BarTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="max-w-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 shadow-lg">
      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.fullLabel}</p>
      <p className="mt-1 text-lg font-bold" style={{ color: ACCENT_COLOR }}>{item.value}</p>
      <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">total mentions</p>
    </div>
  );
}

interface Props {
  data: TrendTimelineData;
}

// Widget ini di Overview cuma untuk sekilas pandang — dibatasi ke top 8 supaya
// tingginya tidak jomplang dibanding widget lain, terlepas dari berapa banyak
// keyword yang di-fetch lewat setting trendRankingTopN.
const MAX_VISIBLE = 8;

export default function TrendNumberPerSearchChart({ data }: Props) {
  const chartData = data.keywords
    .map((keyword) => ({
      fullLabel: keyword,
      label: truncate(keyword),
      value: data.series[keyword]?.total_mentions ?? 0,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, MAX_VISIBLE);

  const isEmpty = chartData.length === 0;
  const maxValue = chartData.reduce((max, item) => Math.max(max, item.value), 0);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40">
          <SlidersHorizontal size={17} className="text-indigo-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Mentions per Keyword (7 Hari)</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Total mentions per keyword &middot; {data.date_from} &ndash; {data.date_to}
          </p>
        </div>
      </div>

      <div className="p-6">
        {isEmpty ? (
          <p className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">Belum ada data mentions</p>
        ) : (
          <div style={{ height: chartData.length * 44 + 20 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 36, left: 0, bottom: 0 }} barSize={20}>
                <CartesianGrid horizontal={false} stroke={GRIDLINE_COLOR} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#898781" }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={180}
                  tick={{ fontSize: 12, fill: "#898781" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(148, 163, 184, 0.08)" }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {chartData.map((item) => (
                    <Cell key={item.fullLabel} fill={colorForValue(item.value, maxValue)} />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="right"
                    style={{ fill: "#898781", fontSize: 11, fontWeight: 600 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
