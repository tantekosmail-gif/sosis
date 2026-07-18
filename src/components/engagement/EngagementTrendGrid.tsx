"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { IconType } from "react-icons";
import { FaFacebook, FaInstagram, FaTiktok, FaXTwitter, FaYoutube } from "react-icons/fa6";

import { ENGAGEMENT_PLATFORMS } from "@/features/engagement/hooks/useEngagementDashboard";
import type { EngagementPlatform, EngagementTrend } from "@/features/engagement/types/engagement.types";
import { PLATFORM_COLOR, PLATFORM_LABEL } from "@/features/engagement/lib/colors";
import { fillDailySeries } from "@/features/engagement/lib/format";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useMetricSource } from "./MetricSource";

const SOURCE_HINT = "Klik untuk lihat sumber data";

const PLATFORM_ICON: Record<EngagementPlatform, IconType> = {
  youtube: FaYoutube,
  tiktok: FaTiktok,
  twitter: FaXTwitter,
  facebook: FaFacebook,
  instagram: FaInstagram,
};

function formatTick(date: string) {
  return new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function TrendTooltip({ active, payload, label, color }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 shadow-lg text-xs">
      <p className="mb-1 font-semibold text-slate-700 dark:text-slate-300">{formatTick(label)}</p>
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ background: color }} />
        <span className="text-slate-500 dark:text-slate-400">Mentions:</span>
        <span className="font-semibold" style={{ color }}>{payload[0].value.toLocaleString("id-ID")}</span>
      </div>
    </div>
  );
}

interface PanelProps {
  platform: EngagementPlatform;
  trend?: EngagementTrend;
  dateFrom: string;
  dateTo: string;
}

function TrendPanel({ platform, trend, dateFrom, dateTo }: PanelProps) {
  const Icon = PLATFORM_ICON[platform];
  const color = PLATFORM_COLOR[platform];
  const data = fillDailySeries(trend?.series ?? [], dateFrom, dateTo);
  const totalMentions = data.reduce((sum, d) => sum + d.mentions, 0);
  const { show } = useMetricSource();
  const showTrendSource = () =>
    show({ metric: "trend", platform, value: `${totalMentions.toLocaleString("id-ID")} mentions` });

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <button
        type="button"
        onClick={showTrendSource}
        title={SOURCE_HINT}
        className="mb-3 flex w-full items-center gap-2 text-left"
      >
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: `${color}1a`, color }}
        >
          <Icon size={11} />
        </span>
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{PLATFORM_LABEL[platform]}</span>
        <span className="ml-auto text-xs text-slate-400 underline decoration-dotted underline-offset-2 hover:text-indigo-500 dark:text-slate-500">
          {totalMentions.toLocaleString("id-ID")} mentions
        </span>
      </button>

      <div className="h-36 cursor-pointer" title={SOURCE_HINT}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 4, right: 4, left: -28, bottom: 0 }}
            onClick={(state) => {
              const withPayload = state as { activeLabel?: string; activePayload?: { payload?: { date?: string; mentions?: number } }[] };
              const date = withPayload?.activeLabel;
              if (!date) return;
              const pointMentions = withPayload?.activePayload?.[0]?.payload?.mentions ?? 0;
              show({
                metric: "trend",
                platform,
                value: `${pointMentions.toLocaleString("id-ID")} mentions`,
                dateFrom: date,
                dateTo: date,
                dateLabel: formatTick(date),
              });
            }}
          >
            <defs>
              <linearGradient id={`engagement-trend-${platform}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.1} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatTick}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              minTickGap={28}
            />
            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} width={36} />
            <Tooltip content={<TrendTooltip color={color} />} />
            <Area
              type="monotone"
              dataKey="mentions"
              stroke={color}
              strokeWidth={2}
              fill={`url(#engagement-trend-${platform})`}
              dot={false}
              activeDot={{ r: 4, stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function formatTableDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

interface TableProps {
  trends: Partial<Record<EngagementPlatform, EngagementTrend>>;
  dateFrom: string;
  dateTo: string;
}

function TrendTable({ trends, dateFrom, dateTo }: TableProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { show } = useMetricSource();

  const seriesByPlatform = ENGAGEMENT_PLATFORMS.map((platform) => ({
    platform,
    data: fillDailySeries(trends[platform]?.series ?? [], dateFrom, dateTo),
  }));
  const dates = seriesByPlatform[0]?.data.map((d) => d.date) ?? [];
  const rows = dates.map((date, i) => ({
    date,
    values: seriesByPlatform.map(({ data }) => data[i]?.mentions ?? 0),
  }));

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        {open ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        {open ? t.engagementTable.hideTable : t.engagementTable.viewAsTable}
      </button>

      {open && (
        <div className="mt-3 max-h-96 overflow-y-auto overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400 dark:bg-slate-950 dark:text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">{t.engagementTable.date}</th>
                {ENGAGEMENT_PLATFORMS.map((platform) => (
                  <th key={platform} className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => show({ metric: "trend", platform })}
                      title={SOURCE_HINT}
                      className="uppercase tracking-wider hover:text-indigo-500"
                    >
                      {PLATFORM_LABEL[platform]}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {rows.map((row) => (
                <tr key={row.date}>
                  <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300">{formatTableDate(row.date)}</td>
                  {row.values.map((value, i) => (
                    <td key={ENGAGEMENT_PLATFORMS[i]} className="px-4 py-2.5 text-right tabular-nums text-slate-700 dark:text-slate-300">
                      {value.toLocaleString("id-ID")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

interface Props {
  trends: Partial<Record<EngagementPlatform, EngagementTrend>>;
  dateFrom: string;
  dateTo: string;
}

export default function EngagementTrendGrid({ trends, dateFrom, dateTo }: Props) {
  const { show } = useMetricSource();

  return (
    <div>
      <button
        type="button"
        onClick={() => show({ metric: "trend" })}
        title={SOURCE_HINT}
        className="mb-1 block text-left font-semibold text-slate-900 underline decoration-slate-200 decoration-dotted underline-offset-4 transition hover:decoration-indigo-400 dark:text-slate-100 dark:decoration-slate-700"
      >
        Tren Mention Harian
      </button>
      <button
        type="button"
        onClick={() => show({ metric: "trend" })}
        title={SOURCE_HINT}
        className="mb-4 block text-left text-xs text-slate-400 hover:text-indigo-500 dark:text-slate-500"
      >
        Panel terpisah per platform, sumbu-Y masing-masing sendiri — skala tiap platform bisa beda jauh.
      </button>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {ENGAGEMENT_PLATFORMS.map((platform) => (
          <TrendPanel key={platform} platform={platform} trend={trends[platform]} dateFrom={dateFrom} dateTo={dateTo} />
        ))}
      </div>
      <TrendTable trends={trends} dateFrom={dateFrom} dateTo={dateTo} />
    </div>
  );
}
