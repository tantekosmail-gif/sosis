"use client";

import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from "recharts";
import { PieChart } from "lucide-react";

import type { ShareOfVoiceItem } from "@/lib/shareOfVoice";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

// Palet kategorikal tervalidasi (8 hue, urutan tetap) — lolos validate_palette.js
// untuk light & dark. Didefinisikan sebagai CSS var lewat Tailwind arbitrary
// property supaya SVG fill (yang tidak bisa pakai class `dark:`) tetap ikut
// berganti warna otomatis sesuai tema.
const SERIES_VARS =
  "[--sov-0:#2a78d6] [--sov-1:#1baf7a] [--sov-2:#eda100] [--sov-3:#008300] [--sov-4:#4a3aa7] [--sov-5:#e34948] [--sov-6:#e87ba4] [--sov-7:#eb6834] " +
  "dark:[--sov-0:#3987e5] dark:[--sov-1:#199e70] dark:[--sov-2:#c98500] dark:[--sov-3:#008300] dark:[--sov-4:#9085e9] dark:[--sov-5:#e66767] dark:[--sov-6:#d55181] dark:[--sov-7:#d95926]";

const SERIES_FILL = Array.from({ length: 8 }, (_, i) => `var(--sov-${i})`);

// Past 7 keyword, sisanya dilipat jadi "Lainnya" (series-count ladder: 7-8 = token ceiling).
const MAX_SLOTS = 7;

interface Segment {
  key: string;
  label: string;
  percentage: number;
  mentions: number;
  fill: string;
}

function buildSegments(items: ShareOfVoiceItem[], otherLabelTemplate: string): Segment[] {
  const sorted = [...items].sort((a, b) => b.percentage - a.percentage);
  const top = sorted.slice(0, MAX_SLOTS);
  const rest = sorted.slice(MAX_SLOTS);

  const segments: Segment[] = top.map((item, idx) => ({
    key: item.keywordId || item.keyword,
    label: item.keyword,
    percentage: item.percentage,
    mentions: item.mentions,
    fill: SERIES_FILL[idx],
  }));

  if (rest.length > 0) {
    segments.push({
      key: "__other__",
      label: otherLabelTemplate.replace("{n}", String(rest.length)),
      percentage: rest.reduce((sum, i) => sum + i.percentage, 0),
      mentions: rest.reduce((sum, i) => sum + i.mentions, 0),
      fill: SERIES_FILL[7],
    });
  }

  return segments;
}

function SliceTooltip({ active, payload }: { active?: boolean; payload?: { payload: Segment }[] }) {
  if (!active || !payload?.length) return null;
  const seg = payload[0].payload;
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs shadow-md">
      <p className="font-semibold text-slate-800 dark:text-slate-200">{seg.label}</p>
      <p className="text-slate-500 dark:text-slate-400">
        {seg.percentage.toFixed(1)}% · {seg.mentions.toLocaleString("id-ID")} mention
      </p>
    </div>
  );
}

export default function ShareOfVoicePieChart({
  items,
  title,
  description,
  headerRight,
}: {
  items: ShareOfVoiceItem[];
  title?: string;
  description?: string;
  headerRight?: React.ReactNode;
}) {
  const { t } = useTranslation();
  const totalMentions = items.reduce((sum, item) => sum + item.mentions, 0);
  const segments = buildSegments(items, t.overviewWidgets.shareOfVoice.otherKeywords);
  const resolvedTitle = title ?? t.overviewWidgets.shareOfVoice.defaultTitle;
  const resolvedDescription = description ?? t.overviewWidgets.shareOfVoice.defaultDesc;

  return (
    <div className={`flex h-full flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-5 ${SERIES_VARS}`}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <PieChart size={16} className="text-indigo-600" />
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">{resolvedTitle}</h2>
        </div>
        {headerRight}
      </div>
      <p className="mb-4 text-xs text-slate-400 dark:text-slate-500">{resolvedDescription}</p>

      {totalMentions === 0 || segments.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 py-6 text-center text-sm text-slate-400 dark:text-slate-500">
          {t.overviewWidgets.shareOfVoice.empty}
        </p>
      ) : (
        <div className="flex flex-col items-center gap-5">
          <div className="relative h-48 w-48 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={segments}
                  dataKey="percentage"
                  nameKey="label"
                  innerRadius="62%"
                  outerRadius="100%"
                  paddingAngle={segments.length > 1 ? 2 : 0}
                  stroke="none"
                  isAnimationActive={false}
                >
                  {segments.map((seg) => (
                    <Cell key={seg.key} fill={seg.fill} />
                  ))}
                </Pie>
                <Tooltip content={<SliceTooltip />} />
              </RechartsPieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {totalMentions.toLocaleString("id-ID")}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">{t.overviewWidgets.shareOfVoice.totalMentionsLabel}</span>
            </div>
          </div>

          <div className="w-full space-y-1.5">
            {segments.map((seg) => (
              <div key={seg.key} className="flex items-center gap-2 text-xs">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: seg.fill }} />
                <span title={seg.label} className="min-w-0 flex-1 truncate font-medium text-slate-700 dark:text-slate-300">
                  {seg.label}
                </span>
                <span className="shrink-0 text-slate-400 dark:text-slate-500">
                  {seg.percentage.toFixed(1)}% · {seg.mentions.toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
