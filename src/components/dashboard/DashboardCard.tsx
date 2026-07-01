"use client";

import { LucideIcon, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface Props {
  title: string;
  value: string | number;
  subtitle?: string;
  growth?: number;
  icon: LucideIcon;
  color?: "blue" | "indigo" | "emerald" | "violet" | "red";
  progress?: number;      // 0–100, tampilkan progress bar
  alert?: boolean;        // highlight merah jika true
}

const colorMap = {
  blue: {
    bg: "bg-blue-50", icon: "text-blue-600", ring: "ring-blue-100", bar: "from-blue-500 to-blue-400",
  },
  indigo: {
    bg: "bg-indigo-50", icon: "text-indigo-600", ring: "ring-indigo-100", bar: "from-indigo-500 to-violet-500",
  },
  emerald: {
    bg: "bg-emerald-50", icon: "text-emerald-600", ring: "ring-emerald-100", bar: "from-emerald-500 to-teal-400",
  },
  violet: {
    bg: "bg-violet-50", icon: "text-violet-600", ring: "ring-violet-100", bar: "from-violet-500 to-indigo-500",
  },
  red: {
    bg: "bg-red-50", icon: "text-red-500", ring: "ring-red-100", bar: "from-red-500 to-rose-400",
  },
};

function formatReach(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString("id-ID");
}

export default function DashboardCard({ title, value, subtitle, growth, icon: Icon, color = "blue", progress, alert }: Props) {
  const c = colorMap[color];
  const positive = (growth ?? 0) >= 0;

  return (
    <div className={`relative rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 ${
      alert ? "border-red-200 bg-red-50/30" : "border-slate-200"
    }`}>
      {alert && (
        <span className="absolute right-4 top-4 flex items-center gap-1 rounded-lg bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600">
          <AlertTriangle size={10} /> Perlu Perhatian
        </span>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <h2 className="mt-3 text-3xl font-bold tabular-nums text-slate-900">{value}</h2>
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}

          {progress !== undefined && (
            <div className="mt-3">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${c.bar} transition-all duration-700`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          )}

          {growth !== undefined && (
            <div className={`mt-3 inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold ${
              positive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
            }`}>
              {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {positive ? "+" : ""}{growth}% vs periode lalu
            </div>
          )}
        </div>

        <div className={`shrink-0 rounded-2xl ${c.bg} p-3.5 ring-4 ${c.ring}`}>
          <Icon className={`h-6 w-6 ${c.icon}`} />
        </div>
      </div>
    </div>
  );
}
