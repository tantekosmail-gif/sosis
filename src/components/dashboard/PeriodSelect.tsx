"use client";

import { PERIOD_PRESETS, type PeriodPreset } from "@/lib/period";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const PRESET_LABEL_KEY: Record<PeriodPreset, "last7" | "last30" | "last90" | "allTime"> = {
  "7d": "last7",
  "30d": "last30",
  "90d": "last90",
  all: "allTime",
};

export default function PeriodSelect({ value, onChange }: { value: PeriodPreset; onChange: (preset: PeriodPreset) => void }) {
  const { t } = useTranslation();
  const labels = t.overviewWidgets.period;

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as PeriodPreset)}
      aria-label={labels.label}
      className="h-7 shrink-0 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-2 pr-6 text-[11px] font-medium text-slate-600 dark:text-slate-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
    >
      {PERIOD_PRESETS.map((preset) => (
        <option key={preset} value={preset}>
          {labels[PRESET_LABEL_KEY[preset]]}
        </option>
      ))}
    </select>
  );
}
