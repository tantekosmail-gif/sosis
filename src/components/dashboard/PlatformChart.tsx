"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { INFO_HINT, useInfoSource } from "@/components/common/InfoSource";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const PLATFORM_COLORS: Record<string, string> = {
  youtube: "#ef4444",
  tiktok: "#1a1a1a",
  instagram: "#e1306c",
  facebook: "#1877f2",
};

const DEFAULT_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899"];

interface Props {
  data: { platform?: string; sentiment?: string; total: number }[];
}

function CustomTooltip({ active, payload, label, total, unit, shareOfTotal }: any) {
  if (!active || !payload?.length) return null;
  const value = Number(payload[0].value) || 0;
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 shadow-lg">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-800 dark:text-slate-200">
        {value.toLocaleString()} <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{unit}</span>
      </p>
      <p className="text-[11px] text-slate-400 dark:text-slate-500">
        {pct}% {shareOfTotal}
      </p>
    </div>
  );
}

export default function PlatformChart({ data }: Props) {
  const { t } = useTranslation();
  const { explain } = useInfoSource();
  const total = data.reduce((sum, entry) => sum + (Number(entry.total) || 0), 0);
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <button
        type="button"
        onClick={() =>
          explain({
            title: t.platformChart.title,
            meaning: "Sebaran jumlah konten yang dianalisis, dikelompokkan per kanal/sumber — untuk melihat dari mana saja topik ini paling banyak dibicarakan.",
            source: "Konten hasil analisis keyword pada halaman ini, dihitung per kanal pembuatnya.",
          })
        }
        title={INFO_HINT}
        className="mb-5 block w-full cursor-pointer text-left"
      >
        <h2 className="font-semibold text-slate-900 underline decoration-slate-200 decoration-dotted underline-offset-4 hover:decoration-indigo-400 dark:text-slate-100 dark:decoration-slate-700">{t.platformChart.title}</h2>
        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{t.platformChart.subtitle}</p>
      </button>

      {/* Bar horizontal: nama kategori (channel) bisa panjang dan banyak —
          label mendatar di sumbu Y selalu terbaca, tanpa rotasi/tabrakan. */}
      <div style={{ height: Math.max(208, data.length * 34 + 24) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 0 }} barSize={18}>
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey={data[0]?.platform !== undefined ? "platform" : "sentiment"}
              width={116}
              interval={0}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickFormatter={(value: string) => (value.length > 16 ? `${value.slice(0, 16)}…` : value)}
              axisLine={false}
              tickLine={false}
            />
            {/* Kursor hover translusen supaya tidak jadi blok putih di dark mode */}
            <Tooltip
              content={
                <CustomTooltip
                  total={total}
                  unit={t.platformChart.videosUnit}
                  shareOfTotal={t.platformChart.shareOfTotal}
                />
              }
              cursor={{ fill: "rgba(148, 163, 184, 0.15)" }}
            />
            <Bar dataKey="total" radius={[0, 4, 4, 0]}>
              {data.map((entry, i) => {
                const key = (entry.platform ?? entry.sentiment ?? "").toLowerCase();
                const color = PLATFORM_COLORS[key] ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length];
                return <Cell key={i} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
