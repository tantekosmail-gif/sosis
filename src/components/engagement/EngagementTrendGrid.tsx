"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { IconType } from "react-icons";
import { FaFacebook, FaInstagram, FaTiktok, FaXTwitter, FaYoutube } from "react-icons/fa6";

import { ENGAGEMENT_PLATFORMS } from "@/features/engagement/hooks/useEngagementDashboard";
import type { EngagementPlatform, EngagementTrend } from "@/features/engagement/types/engagement.types";
import { PLATFORM_COLOR, PLATFORM_LABEL } from "@/features/engagement/lib/colors";
import { fillDailySeries } from "@/features/engagement/lib/format";

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

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: `${color}1a`, color }}
        >
          <Icon size={11} />
        </span>
        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{PLATFORM_LABEL[platform]}</span>
        <span className="ml-auto text-xs text-slate-400 dark:text-slate-500">
          {totalMentions.toLocaleString("id-ID")} mentions
        </span>
      </div>

      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
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

interface Props {
  trends: Partial<Record<EngagementPlatform, EngagementTrend>>;
  dateFrom: string;
  dateTo: string;
}

export default function EngagementTrendGrid({ trends, dateFrom, dateTo }: Props) {
  return (
    <div>
      <h2 className="mb-1 font-semibold text-slate-900 dark:text-slate-100">Tren Mention Harian</h2>
      <p className="mb-4 text-xs text-slate-400 dark:text-slate-500">
        Panel terpisah per platform, sumbu-Y masing-masing sendiri — skala tiap platform bisa beda jauh.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {ENGAGEMENT_PLATFORMS.map((platform) => (
          <TrendPanel key={platform} platform={platform} trend={trends[platform]} dateFrom={dateFrom} dateTo={dateTo} />
        ))}
      </div>
    </div>
  );
}
