"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { INFO_HINT, useInfoSource, type SentimentKind } from "@/components/common/InfoSource";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const SENTIMENT_MEANING: Record<SentimentKind, string> = {
  positive: "Komentar yang mendukung, memuji, atau menyambut baik topik yang dianalisis.",
  neutral: "Komentar yang sekadar bertanya, menginformasikan, atau tidak menunjukkan keberpihakan.",
  negative: "Komentar yang mengkritik, menolak, atau menunjukkan kekecewaan terhadap topik yang dianalisis.",
};

const ANALYSIS_SOURCE =
  "Komentar publik pada konten hasil analisis keyword di halaman ini — nada tiap komentar dinilai otomatis oleh sistem analisis sentimen.";

interface Props {
  data: { sentiment: string; total: number }[];
}

function CustomTooltip({ active, payload, config, total, unit }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  const cfg = config?.find((c: any) => c.key === d.name);
  const value = Number(d.value) || 0;
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 shadow-lg">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {cfg && <span className={`h-2 w-2 shrink-0 rounded-full ${cfg.bg}`} />}
        {cfg?.label ?? d.name}
      </p>
      <p className="mt-1 text-lg font-bold text-slate-800 dark:text-slate-200">{pct}%</p>
      <p className="text-[11px] text-slate-400 dark:text-slate-500">
        {value.toLocaleString()} {unit}
      </p>
    </div>
  );
}

export default function SentimentPie({ data }: Props) {
  const { t } = useTranslation();
  const { explain } = useInfoSource();
  const CONFIG = [
    { key: "positive", label: t.sentimentPie.positive, color: "#10b981", bg: "bg-emerald-500" },
    { key: "neutral",  label: t.sentimentPie.neutral,  color: "#f59e0b", bg: "bg-amber-400" },
    { key: "negative", label: t.sentimentPie.negative, color: "#ef4444", bg: "bg-red-500" },
  ];
  const safeData = data || [];
  const total = safeData.reduce((s, d) => s + d.total, 0);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <button
        type="button"
        onClick={() =>
          explain({
            title: t.sentimentPie.title,
            value: total.toLocaleString("id-ID"),
            meaning: "Perbandingan jumlah komentar bernada positif, netral, dan negatif dari seluruh komentar yang dianalisis untuk topik ini.",
            source: ANALYSIS_SOURCE,
          })
        }
        title={INFO_HINT}
        className="mb-5 block w-full cursor-pointer text-left"
      >
        <h2 className="font-semibold text-slate-900 underline decoration-slate-200 decoration-dotted underline-offset-4 hover:decoration-indigo-400 dark:text-slate-100 dark:decoration-slate-700">{t.sentimentPie.title}</h2>
        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{t.sentimentPie.subtitle}</p>
      </button>

      <div className="flex items-center gap-6">
        {/* Donut */}
        <div className="relative h-52 w-52 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={safeData}
                dataKey="total"
                nameKey="sentiment"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                strokeWidth={0}
              >
                {safeData.map((_, i) => (
                  <Cell key={i} fill={CONFIG[i % CONFIG.length].color} />
                ))}
              </Pie>
              <Tooltip
                content={<CustomTooltip config={CONFIG} total={total} unit={t.sentimentPie.commentsUnit} />}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">{total.toLocaleString()}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3">
          {safeData.map((item, i) => {
            const cfg = CONFIG[i % CONFIG.length];
            const pct = total > 0 ? Math.round((item.total / total) * 100) : 0;
            const kind = (cfg.key as SentimentKind) ?? "neutral";
            return (
              <button
                key={item.sentiment}
                type="button"
                onClick={() =>
                  explain({
                    title: `${t.sentimentPie.title} — ${cfg.label}`,
                    value: `${pct}% (${item.total.toLocaleString("id-ID")} ${t.sentimentPie.commentsUnit})`,
                    sentiment: kind,
                    meaning: SENTIMENT_MEANING[kind],
                    source: ANALYSIS_SOURCE,
                  })
                }
                title={INFO_HINT}
                className="block w-full cursor-pointer text-left"
              >
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${cfg.bg}`} />
                    <span className="font-medium text-slate-700 dark:text-slate-300">{cfg.label}</span>
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{pct}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: cfg.color }}
                  />
                </div>
                <p className="mt-0.5 text-right text-[11px] text-slate-400 dark:text-slate-500">
                  {item.total.toLocaleString()} {t.sentimentPie.commentsUnit}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
