"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, PieChart, Pie, Cell, Legend } from "recharts";
import { ShieldCheck, type LucideIcon } from "lucide-react";

import type { TrendDiscoveryTopic } from "@/features/trends/types/discovery.types";
import { CATEGORICAL_PALETTE, OTHER_COLOR } from "@/lib/chartColors";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const TOP_N = 5;

function truncate(topic: string, max = 26) {
  const clean = topic.trim();
  return clean.length > max ? `${clean.slice(0, max).trimEnd()}…` : clean;
}

interface Props {
  topics: TrendDiscoveryTopic[];
  date: string;
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  accentColor?: string;
  /** Show cross-source confirmation info (only meaningful on the combined view). */
  showConfirmation?: boolean;
  chartType?: "bar" | "pie";
}

export default function TrendDiscoveryChart({
  topics,
  date,
  title = "Trend Discovery",
  subtitle,
  icon: Icon = ShieldCheck,
  iconClassName = "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600",
  accentColor = "#6366f1",
  showConfirmation = true,
  chartType = "bar",
}: Props) {
  const { t } = useTranslation();
  const unconfirmed = topics.filter((topic) => !topic.confirmed_by || topic.confirmed_by.length === 0).length;

  const ranked = topics
    .map((topic) => ({ ...topic, value: Math.round(topic.score * 100), label: truncate(topic.topic) }))
    .sort((a, b) => b.value - a.value);

  const chartData = ranked.slice(0, 10);

  const top = ranked.slice(0, TOP_N);
  const rest = ranked.slice(TOP_N);
  const restTotal = rest.reduce((sum, topic) => sum + topic.value, 0);
  const pieData = [
    ...top.map((topic, i) => ({ ...topic, name: topic.label, fill: CATEGORICAL_PALETTE[i % CATEGORICAL_PALETTE.length] })),
    ...(rest.length > 0 ? [{ name: t.overviewWidgets.common.other, value: restTotal, count: rest.length, fill: OTHER_COLOR }] : []),
  ];

  function BarTooltip({ active, payload }: any) {
    if (!active || !payload?.length) return null;
    const item = payload[0].payload;
    return (
      <div className="max-w-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 shadow-lg">
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.topic}</p>
        <p className="mt-1 text-lg font-bold" style={{ color: accentColor }}>
          {Math.round(item.score * 100)}%
        </p>
        <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">{t.overviewWidgets.trendDiscovery.tooltipScore}</p>
        {showConfirmation &&
          (item.confirmed_by?.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-1">
              {item.confirmed_by.map((s: string) => (
                <span key={s} className="rounded-md bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium capitalize text-slate-600 dark:text-slate-400">
                  {s.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">{t.overviewWidgets.trendDiscovery.notValidated}</p>
          ))}
        {item.related_accounts?.length > 0 && (
          <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">
            {t.overviewWidgets.trendDiscovery.relatedAccounts.replace("{n}", String(item.related_accounts.length))}
          </p>
        )}
      </div>
    );
  }

  function PieTooltip({ active, payload }: any) {
    if (!active || !payload?.length) return null;
    const item = payload[0].payload;
    return (
      <div className="max-w-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 shadow-lg">
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.name}</p>
        <p className="mt-1 text-lg font-bold" style={{ color: item.fill }}>
          {item.count ? `${item.count} ${t.overviewWidgets.common.topicUnit}` : `${item.value}%`}
        </p>
        <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
          {item.count ? t.overviewWidgets.trendDiscovery.mergedIntoOther : t.overviewWidgets.trendDiscovery.tooltipScore}
        </p>
      </div>
    );
  }

  const isEmpty = chartType === "pie" ? pieData.length === 0 : chartData.length === 0;
  const pieTotal = pieData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconClassName}`}>
            <Icon size={17} />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">{subtitle} &middot; {date}</p>
          </div>
        </div>
        {showConfirmation && unconfirmed > 0 && (
          <span className="shrink-0 text-[11px] text-slate-400 dark:text-slate-500">
            {t.overviewWidgets.trendDiscovery.unconfirmedLine.replace("{n}", String(unconfirmed))}
          </span>
        )}
      </div>

      {isEmpty ? (
        <p className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">{t.overviewWidgets.trendDiscovery.empty}</p>
      ) : chartType === "pie" ? (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="85%"
                paddingAngle={2}
                stroke="#ffffff"
                strokeWidth={2}
                label={({ value }) => `${Math.round((value / pieTotal) * 100)}%`}
                labelLine={false}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-xs text-slate-600 dark:text-slate-400">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={{ height: chartData.length * 36 + 20 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 36, left: 0, bottom: 0 }} barSize={20}>
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis
                type="category"
                dataKey="label"
                width={160}
                tick={{ fontSize: 12, fill: "#475569" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<BarTooltip />} cursor={{ fill: "#f8fafc" }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} fill={accentColor}>
                <LabelList
                  dataKey="value"
                  position="right"
                  formatter={(v: unknown) => `${v}%`}
                  style={{ fill: "#475569", fontSize: 11, fontWeight: 600 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
