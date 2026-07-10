"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const SERIES = [
  { key: "totalPosts", label: "Total Post", color: "#6366f1" },
  { key: "totalComments", label: "Total Komentar", color: "#0284c7" },
] as const;

function formatCompact(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}Jt`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
          {p.name}
          <span className="font-semibold text-slate-900 dark:text-slate-100">{Number(p.value).toLocaleString("id-ID")}</span>
        </p>
      ))}
    </div>
  );
}

export interface PlatformVolumeDatum {
  label: string;
  totalPosts: number;
  totalComments: number;
}

export default function PlatformVolumeChart({ data }: { data: PlatformVolumeDatum[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {SERIES.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label}
          </span>
        ))}
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }} barGap={4} barCategoryGap="20%">
            <CartesianGrid vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#475569" }} interval={0} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatCompact}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
            {SERIES.map((s) => (
              <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} radius={[4, 4, 0, 0]} maxBarSize={24} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
