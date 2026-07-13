export type PeriodPreset = "7d" | "30d" | "90d" | "all";

export const PERIOD_PRESETS: PeriodPreset[] = ["7d", "30d", "90d", "all"];

// Sama dengan SOV_ALL_TIME_FROM di topic.service.ts — cukup jauh ke belakang
// supaya mencakup semua data historis tanpa perlu tahu tanggal data tertua.
const ALL_TIME_FROM = "2000-01-01T00:00:00Z";

export interface DateRange {
  date_from: string;
  date_to: string;
}

export function periodToRange(preset: PeriodPreset): DateRange {
  const date_to = new Date().toISOString();
  if (preset === "all") return { date_from: ALL_TIME_FROM, date_to };

  const days = preset === "7d" ? 7 : preset === "30d" ? 30 : 90;
  const date_from = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  return { date_from, date_to };
}
