"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const PLATFORM_COLORS: Record<string, string> = {
  youtube: "#ef4444",
  tiktok: "#1a1a1a",
  instagram: "#e1306c",
  facebook: "#1877f2",
};

const DEFAULT_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899"];

interface Props {
  data: { platform?: string; sentiment?: string; total: number }[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-800">{payload[0].value?.toLocaleString()}</p>
    </div>
  );
}

export default function PlatformChart({ data }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="font-semibold text-slate-900">Distribusi Platform</h2>
        <p className="mt-0.5 text-xs text-slate-400">Jumlah konten per platform</p>
      </div>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={28}>
            <XAxis
              dataKey={data[0]?.platform !== undefined ? "platform" : "sentiment"}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
            <Bar dataKey="total" radius={[6, 6, 0, 0]}>
              {data.map((entry, i) => {
                const key = (entry.platform ?? entry.sentiment ?? "").toLowerCase();
                const color = PLATFORM_COLORS[key] ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length];
                return <Cell key={i} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
