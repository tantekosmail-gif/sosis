"use client";

import { useEffect } from "react";
import { Search } from "lucide-react";

import { useFilterStore, dateRangeFromDaysBack } from "@/stores/filterStore";
import { useDashboardStore } from "@/store/dashboard.store";
import { useAnalyze } from "@/features/analysis/hooks/useAnalyze";
import AnalyzeButton from "@/components/analysis/AnalyzeButton";

// "24 Jam" pakai 1 hari ke belakang (bukan 0) supaya jendela 24 jam terakhir
// tetap tercakup penuh walau filter tanggal ini cuma presisi per-hari
// (misal jam 01:00, sebagian besar 24 jam terakhir jatuh di tanggal kemarin).
const DATE_PRESETS = [
  { label: "24 Jam", days: 1 },
  { label: "1 Minggu", days: 7 },
  { label: "1 Bulan", days: 30 },
] as const;

export default function FilterBar({ showSearch = true }: { showSearch?: boolean } = {}) {
  const { keyword, startDate, endDate, platform, setPlatform, setKeyword, setStartDate, setEndDate } = useFilterStore();
  const dashboard = useDashboardStore((s) => s.dashboard);
  const loading = useDashboardStore((s) => s.loading);
  const { execute } = useAnalyze();
  const hasDateFilter = !!(startDate && endDate);

  // Riset Topik cuma didukung untuk YouTube — endpoint smart-search
  // platform lain (TikTok/Instagram/Facebook/Twitter) belum tersedia di backend.
  // Pakai halaman platform masing-masing untuk analisis akun spesifik.
  useEffect(() => {
    setPlatform("youtube");
  }, [setPlatform]);

  function clearDate() {
    setStartDate("");
    setEndDate("");
  }

  // Filter tanggal cuma mengubah state — dashboard yang sudah tampil tidak
  // ikut ter-update kecuali analisis dijalankan ulang. Kalau sudah ada hasil
  // aktif, langsung re-analisis supaya klik preset/ubah tanggal manual
  // langsung terasa, bukan diam sampai user menekan Analyze lagi.
  function reAnalyzeIfActive() {
    if (dashboard && keyword.trim() && !loading) {
      void execute(platform, keyword);
    }
  }

  function applyPreset(days: number) {
    const range = dateRangeFromDaysBack(days);
    setStartDate(range.startDate);
    setEndDate(range.endDate);
    reAnalyzeIfActive();
  }

  function handleManualDate(which: "start" | "end", value: string) {
    if (which === "start") setStartDate(value);
    else setEndDate(value);
    reAnalyzeIfActive();
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
      <div className="space-y-4 p-5">
        {/* Keyword + actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          {showSearch && (
            <div className="min-w-52 flex-1">
              <label className="mb-2.5 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Keyword
              </label>
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  placeholder="Masukkan keyword pencarian YouTube..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && document.getElementById("analyze-btn")?.click()}
                  className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-10 pr-4 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                />
              </div>
            </div>
          )}

          {showSearch && (
            <div className="shrink-0">
              <AnalyzeButton />
            </div>
          )}
        </div>

        {/* Date range: preset cepat + input manual, selalu tampil */}
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 px-4 py-3">
          <div className="flex shrink-0 items-center gap-1.5">
            {DATE_PRESETS.map((preset) => {
              const range = dateRangeFromDaysBack(preset.days);
              const active = startDate === range.startDate && endDate === range.endDate;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyPreset(preset.days)}
                  className={`h-9 rounded-xl px-3 text-xs font-semibold transition-colors ${
                    active
                      ? "bg-indigo-600 text-white"
                      : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <label className="shrink-0 text-xs text-slate-500 dark:text-slate-400">Dari</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleManualDate("start", e.target.value)}
              className="h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-700 dark:text-slate-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="shrink-0 text-xs text-slate-500 dark:text-slate-400">Sampai</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleManualDate("end", e.target.value)}
              className="h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-700 dark:text-slate-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            />
          </div>
          {hasDateFilter && (
            <button onClick={clearDate} className="text-xs text-slate-400 dark:text-slate-500 transition-colors hover:text-red-500">
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
