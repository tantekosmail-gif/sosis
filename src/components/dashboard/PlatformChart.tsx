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
import { useTranslation } from "@/lib/i18n/LanguageProvider";

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
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 shadow-lg">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-800 dark:text-slate-200">{payload[0].value?.toLocaleString()}</p>
    </div>
  );
}

export default function PlatformChart({ data }: Props) {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t.platformChart.title}</h2>
        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{t.platformChart.subtitle}</p>
      </div>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={28}>
            <XAxis
              dataKey={data[0]?.platform !== undefined ? "platform" : "sentiment"}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickFormatter={(value: string) => (value.length > 12 ? `${value.slice(0, 12)}…` : value)}
              interval={0}
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
