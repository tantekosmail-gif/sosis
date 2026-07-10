"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { DashboardTimeline } from "@/types/dashboard.type";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface Props {
  data: DashboardTimeline[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  let dateLabel = label;
  try {
    dateLabel = format(new Date(label), "d MMM yyyy", { locale: idLocale });
  } catch {}

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 shadow-lg text-xs">
      <p className="mb-2 font-semibold text-slate-700 dark:text-slate-300">{dateLabel}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 py-0.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-slate-500 dark:text-slate-400">{p.name}:</span>
          <span className="font-semibold" style={{ color: p.color }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function SentimentTimeline({ data }: Props) {
  if (!data || data.length === 0) return null;

  const formatted = data.map((d) => {
    let label = d.date;
    try { label = format(new Date(d.date), "d MMM", { locale: idLocale }); } catch {}
    return { ...d, label };
  });

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40">
          <TrendingUp size={17} className="text-indigo-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Tren Sentimen Waktu</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">Perubahan sentimen komentar per hari</p>
        </div>
      </div>

      <div className="p-6">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={formatted} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
              formatter={(v) =>
                v === "positive" ? "Positif" : v === "negative" ? "Negatif" : v === "neutral" ? "Netral" : v
              }
            />
            <Line
              type="monotone"
              dataKey="positive"
              name="positive"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="neutral"
              name="neutral"
              stroke="#94a3b8"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="negative"
              name="negative"
              stroke="#f43f5e"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
