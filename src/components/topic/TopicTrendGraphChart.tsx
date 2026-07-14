"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { LineChart as LineChartIcon } from "lucide-react";
import { format, type Locale } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";

import type { TopicTrendGraph } from "@/features/topic/lib/topicTrendGraph";
import { PLATFORM_ORDER } from "@/features/topic/lib/topicTrendGraph";
import { platformMeta } from "@/features/topic/lib/topicDetail";
import { CATEGORICAL_PALETTE } from "@/lib/chartColors";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const SENTIMENT_SERIES = [
  { key: "positive", color: "#10b981" },
  { key: "neutral", color: "#f59e0b" },
  { key: "negative", color: "#ef4444" },
] as const;

function platformColor(platform: string) {
  const idx = PLATFORM_ORDER.indexOf(platform);
  return CATEGORICAL_PALETTE[(idx >= 0 ? idx : PLATFORM_ORDER.length) % CATEGORICAL_PALETTE.length];
}

function formatDay(date: string, locale: Locale) {
  try {
    return format(new Date(date), "d MMM", { locale });
  } catch {
    return date;
  }
}

function TooltipCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 shadow-lg text-xs">
      {children}
    </div>
  );
}

function VolumeTooltip({ active, payload, label, locale }: any) {
  if (!active || !payload?.length) return null;
  return (
    <TooltipCard>
      <p className="mb-1.5 font-semibold text-slate-700 dark:text-slate-300">{formatDay(label, locale)}</p>
      {payload
        .filter((p: any) => p.value > 0)
        .map((p: any) => (
          <div key={p.dataKey} className="flex items-center justify-between gap-4 py-0.5">
            <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
              {p.name}
            </span>
            <span className="font-semibold" style={{ color: p.color }}>
              {p.value}
            </span>
          </div>
        ))}
    </TooltipCard>
  );
}

interface Props {
  data: TopicTrendGraph;
  days: number;
  onDaysChange: (days: number) => void;
}

export default function TopicTrendGraphChart({ data, days, onDaysChange }: Props) {
  const { t, language } = useTranslation();
  const locale = language === "en" ? enUS : idLocale;
  const labels = t.topics.detail.trendGraph;

  const volumeData = data.days.map((d) => ({ date: d.date, ...d.platforms }));
  const sentimentData = data.days.map((d) => ({ date: d.date, ...d.sentiment }));
  const subTopics = Array.from(new Set(data.days.flatMap((d) => d.newSubTopics)));
  const isEmpty = data.days.length === 0;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-5">
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <LineChartIcon size={16} className="text-indigo-600" />
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">{labels.title}</h2>
        </div>
        <select
          value={days}
          onChange={(e) => onDaysChange(Number(e.target.value))}
          aria-label={labels.daysLabel}
          className="h-7 shrink-0 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-2 pr-6 text-[11px] font-medium text-slate-600 dark:text-slate-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
        >
          <option value={7}>{labels.days7}</option>
          <option value={14}>{labels.days14}</option>
          <option value={30}>{labels.days30}</option>
        </select>
      </div>
      <p className="mb-4 text-xs text-slate-400 dark:text-slate-500">{labels.desc.replace("{n}", String(days))}</p>

      {isEmpty ? (
        <p className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 py-8 text-center text-sm text-slate-400 dark:text-slate-500">
          {labels.empty}
        </p>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {labels.volumeTitle}
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={volumeData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barCategoryGap="20%">
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v) => formatDay(v, locale)}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                  minTickGap={16}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<VolumeTooltip locale={locale} />} cursor={{ fill: "#f8fafc" }} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} iconType="circle" iconSize={8} />
                {data.platformKeys.map((platform, i) => (
                  <Bar
                    key={platform}
                    dataKey={platform}
                    name={platformMeta(platform).label}
                    stackId="platforms"
                    fill={platformColor(platform)}
                    radius={i === data.platformKeys.length - 1 ? [4, 4, 0, 0] : undefined}
                    maxBarSize={32}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {labels.sentimentTitle}
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={sentimentData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barCategoryGap="20%">
                <CartesianGrid vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v) => formatDay(v, locale)}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                  minTickGap={16}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<VolumeTooltip locale={locale} />} cursor={{ fill: "#f8fafc" }} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} iconType="circle" iconSize={8} />
                {SENTIMENT_SERIES.map((s, i) => (
                  <Bar
                    key={s.key}
                    dataKey={s.key}
                    name={t.sentimentPie[s.key as "positive" | "neutral" | "negative"]}
                    stackId="sentiment"
                    fill={s.color}
                    radius={i === SENTIMENT_SERIES.length - 1 ? [4, 4, 0, 0] : undefined}
                    maxBarSize={32}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {subTopics.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {labels.subTopicsTitle}
              </h3>
              <div className="flex flex-wrap gap-2">
                {subTopics.map((sub) => (
                  <span
                    key={sub}
                    className="rounded-lg bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
