"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from "recharts";
import { Activity } from "lucide-react";
import { format, type Locale } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";

import type { TrendTimelineData } from "@/features/trends/types/timeline.types";
import { CATEGORICAL_PALETTE } from "@/lib/chartColors";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

function formatBucket(bucket: string, interval: string, locale: Locale) {
  try {
    return format(new Date(bucket), interval === "day" ? "d MMM" : "HH:mm", { locale });
  } catch {
    return bucket;
  }
}

function CustomTooltip({ active, payload, label, interval, locale }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 shadow-lg text-xs">
      <p className="mb-2 font-semibold text-slate-700 dark:text-slate-300">{formatBucket(label, interval, locale)}</p>
      {payload
        .slice()
        .sort((a: any, b: any) => b.value - a.value)
        .map((p: any) => (
          <div key={p.dataKey} className="flex items-center justify-between gap-4 py-0.5">
            <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
              {p.name}
            </span>
            <span className="font-semibold" style={{ color: p.color }}>{p.value}</span>
          </div>
        ))}
    </div>
  );
}

interface Props {
  data: TrendTimelineData;
}

export default function TrendTimelineChart({ data }: Props) {
  const { keywords, series, interval } = data;
  const { t, language } = useTranslation();
  const locale = language === "en" ? enUS : idLocale;

  const bucketOrder = keywords.length > 0 ? series[keywords[0]]?.total.map((p) => p.bucket) ?? [] : [];

  const chartData = bucketOrder.map((bucket, i) => {
    const row: Record<string, string | number> = { time: bucket };
    keywords.forEach((kw) => {
      row[kw] = series[kw]?.total[i]?.count ?? 0;
    });
    return row;
  });

  const isEmpty = keywords.length === 0 || chartData.length === 0;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40">
          <Activity size={17} className="text-indigo-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t.overviewWidgets.trendTimeline.title}</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {t.overviewWidgets.trendTimeline.descLine
              .replace("{unit}", interval === "day" ? t.overviewWidgets.trendTimeline.unitDay : t.overviewWidgets.trendTimeline.unitHour)
              .replace("{n}", String(keywords.length))}
          </p>
        </div>
      </div>

      <div className="p-6">
        {isEmpty ? (
          <p className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">{t.overviewWidgets.trendTimeline.empty}</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData} margin={{ top: 4, right: 16, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="time"
                tickFormatter={(v) => formatBucket(v, interval, locale)}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
                minTickGap={24}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip interval={interval} locale={locale} />} />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
                iconType="circle"
                iconSize={8}
                itemSorter={() => 0}
              />
              {keywords.map((kw, i) => (
                <Line
                  key={kw}
                  type="monotone"
                  dataKey={kw}
                  name={kw}
                  stroke={CATEGORICAL_PALETTE[i % CATEGORICAL_PALETTE.length]}
                  strokeWidth={i === 0 ? 3 : 2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
