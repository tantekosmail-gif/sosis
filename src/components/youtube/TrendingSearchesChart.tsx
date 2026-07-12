"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp } from "lucide-react";

import type { YoutubeTrendingItem } from "@/features/youtube/types/trending.types";
import { CATEGORICAL_PALETTE, OTHER_COLOR } from "@/lib/chartColors";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const TOP_N = 5;

function parseTraffic(traffic: string): number {
  const n = parseInt(traffic.replace(/[^0-9]/g, ""), 10);
  return Number.isNaN(n) ? 0 : n;
}

function truncate(title: string, max = 26) {
  const clean = title.trim();
  return clean.length > max ? `${clean.slice(0, max).trimEnd()}…` : clean;
}

function getLatestBatch(items: YoutubeTrendingItem[]): YoutubeTrendingItem[] {
  if (items.length === 0) return [];
  const latest = items.reduce((max, item) => (item.fetched_at > max ? item.fetched_at : max), items[0].fetched_at);
  return items.filter((item) => item.fetched_at === latest);
}

function CustomTooltip({ active, payload, topicUnit, mergedIntoOtherLabel, searchUnit }: any) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="max-w-xs rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.name}</p>
      <p className="mt-1 text-lg font-bold" style={{ color: item.fill }}>
        {item.count ? `${item.count} ${topicUnit}` : item.traffic}
      </p>
      <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
        {item.count ? mergedIntoOtherLabel : searchUnit}
      </p>
    </div>
  );
}

interface Props {
  items: YoutubeTrendingItem[];
  geo: string;
  period: string;
}

export default function TrendingSearchesChart({ items, geo, period }: Props) {
  const { t, language } = useTranslation();
  const latestBatch = getLatestBatch(items);
  const ranked = latestBatch
    .map((item) => ({ ...item, value: parseTraffic(item.traffic) }))
    .sort((a, b) => b.value - a.value);

  const top = ranked.slice(0, TOP_N);
  const rest = ranked.slice(TOP_N);
  const restTotal = rest.reduce((sum, item) => sum + item.value, 0);

  const pieData = [
    ...top.map((item, i) => ({
      name: truncate(item.title),
      value: item.value,
      traffic: item.traffic,
      fill: CATEGORICAL_PALETTE[i % CATEGORICAL_PALETTE.length],
    })),
    ...(rest.length > 0 ? [{ name: t.overviewWidgets.common.other, value: restTotal, count: rest.length, fill: OTHER_COLOR }] : []),
  ];

  const total = pieData.reduce((sum, d) => sum + d.value, 0);
  const updatedAt = latestBatch[0]?.fetched_at;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40">
            <TrendingUp size={17} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t.overviewWidgets.trendingSearches.title}</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {t.overviewWidgets.trendingSearches.descLine.replace("{geo}", geo).replace("{period}", period)}
            </p>
          </div>
        </div>
        {updatedAt && (
          <span className="shrink-0 text-[11px] text-slate-400 dark:text-slate-500">
            {t.overviewWidgets.trendingSearches.updatedPrefix} {formatRelativeTime(updatedAt, language)}
          </span>
        )}
      </div>

      {pieData.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">{t.overviewWidgets.trendingSearches.empty}</p>
      ) : (
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
                label={({ value }) => `${Math.round((value / total) * 100)}%`}
                labelLine={false}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                content={
                  <CustomTooltip
                    topicUnit={t.overviewWidgets.common.topicUnit}
                    mergedIntoOtherLabel={t.overviewWidgets.trendDiscovery.mergedIntoOther}
                    searchUnit={t.overviewWidgets.trendingSearches.searchUnit}
                  />
                }
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-xs text-slate-600 dark:text-slate-400">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
