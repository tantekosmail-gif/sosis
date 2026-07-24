"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import type { SnapshotTrendPoint } from "../hooks/usePlatformSnapshot";

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const point: SnapshotTrendPoint = payload[0].payload;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{point.label}</p>
      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">{point.count} posts</p>
    </div>
  );
}

export default function SnapshotSparkline({ data, color }: { data: SnapshotTrendPoint[]; color: string }) {
  const gradientId = `snapshot-spark-${color.replace("#", "")}`;

  return (
    <div className="h-16 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            minTickGap={40}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "3 3" }} />
          <Area
            type="monotone"
            dataKey="count"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 3, fill: color, stroke: "#fff", strokeWidth: 1 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
