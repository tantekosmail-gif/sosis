"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { DashboardTimeline } from "@/types/dashboard.type";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { INFO_HINT, useInfoSource } from "@/components/common/InfoSource";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

interface Props {
  data: DashboardTimeline[];
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  let dateLabel = label;
  try {
    dateLabel = format(new Date(label), "d MMM yyyy", { locale: idLocale });
  } catch {}

  const dayTotal = payload.reduce((sum: number, p: any) => sum + (Number(p.value) || 0), 0);

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 shadow-lg text-xs">
      <p className="mb-2 font-semibold text-slate-700 dark:text-slate-300">{dateLabel}</p>
      {payload.map((p: any) => {
        const value = Number(p.value) || 0;
        const pct = dayTotal > 0 ? Math.round((value / dayTotal) * 100) : 0;
        return (
          <div key={p.dataKey} className="flex items-center gap-2 py-0.5">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-slate-500 dark:text-slate-400">{p.name}:</span>
            <span className="font-semibold" style={{ color: p.color }}>{p.value}</span>
            <span className="text-slate-400 dark:text-slate-500">({pct}%)</span>
          </div>
        );
      })}
      <p className="mt-1.5 border-t border-slate-100 pt-1.5 text-slate-400 dark:border-slate-800 dark:text-slate-500">
        Total {dayTotal} komentar
      </p>
    </div>
  );
}

export default function SentimentTimeline({ data }: Props) {
  const { t } = useTranslation();
  const { explain } = useInfoSource();
  if (!data || data.length === 0) return null;

  // Garis chart ini murni jumlah komentar per sentimen per hari. Kalau semua
  // nilainya nol (belum ada komentar dianalisis pada rentang ini), chart flat
  // di nol hanya menyesatkan — sembunyikan kartunya sekalian.
  const hasSentiment = data.some((d) => (d.positive ?? 0) + (d.neutral ?? 0) + (d.negative ?? 0) > 0);
  if (!hasSentiment) return null;

  const formatted = data.map((d) => {
    let label = d.date;
    try { label = format(new Date(d.date), "d MMM", { locale: idLocale }); } catch {}
    return { ...d, label };
  });

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() =>
          explain({
            title: t.sentimentTimeline.title,
            meaning: "Perkembangan jumlah komentar positif, netral, dan negatif dari hari ke hari — untuk melihat kapan sentimen publik berubah arah.",
            source: "Komentar publik hasil analisis keyword pada halaman ini, dikelompokkan menurut tanggal terbitnya.",
          })
        }
        title={INFO_HINT}
        className="flex w-full cursor-pointer items-center gap-3 border-b border-slate-100 px-6 py-5 text-left dark:border-slate-800"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40">
          <TrendingUp size={17} className="text-indigo-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 underline decoration-slate-200 decoration-dotted underline-offset-4 hover:decoration-indigo-400 dark:text-slate-100 dark:decoration-slate-700">{t.sentimentTimeline.title}</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">{t.sentimentTimeline.subtitle}</p>
        </div>
      </button>

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
                v === "positive" ? t.sentimentPie.positive : v === "negative" ? t.sentimentPie.negative : v === "neutral" ? t.sentimentPie.neutral : v
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
