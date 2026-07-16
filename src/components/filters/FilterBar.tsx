"use client";

import { useEffect, useState } from "react";
import { Search, CalendarDays, X } from "lucide-react";

import { useFilterStore } from "@/stores/filterStore";
import AnalyzeButton from "@/components/analysis/AnalyzeButton";

function formatDate(d: string) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  } catch {
    return d;
  }
}

export default function FilterBar({ showSearch = true }: { showSearch?: boolean } = {}) {
  const { keyword, startDate, endDate, setPlatform, setKeyword, setStartDate, setEndDate } = useFilterStore();
  const [showDate, setShowDate] = useState(false);
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
    setShowDate(false);
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

          <div className={`flex shrink-0 items-center gap-2 ${showSearch ? "" : "sm:ml-auto"}`}>
            <button
              onClick={() => setShowDate((v) => !v)}
              className={`flex h-10 items-center gap-2 rounded-xl border px-3.5 text-sm font-medium transition-all ${
                hasDateFilter || showDate
                  ? "border-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <CalendarDays size={15} />
              <span className="hidden sm:inline">
                {hasDateFilter ? `${formatDate(startDate)} – ${formatDate(endDate)}` : "Filter Tanggal"}
              </span>
              {hasDateFilter && (
                <span
                  role="button"
                  aria-label="Hapus filter tanggal"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearDate();
                  }}
                  className="-mr-1 rounded-full p-0.5 hover:bg-indigo-100"
                >
                  <X size={12} />
                </span>
              )}
            </button>

            {showSearch && <AnalyzeButton />}
          </div>
        </div>

        {/* Date range inputs (collapsible) */}
        {showDate && (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <label className="shrink-0 text-xs text-slate-500 dark:text-slate-400">Dari</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-700 dark:text-slate-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="shrink-0 text-xs text-slate-500 dark:text-slate-400">Sampai</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-sm text-slate-700 dark:text-slate-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
              />
            </div>
            {hasDateFilter && (
              <button onClick={clearDate} className="text-xs text-slate-400 dark:text-slate-500 transition-colors hover:text-red-500">
                Reset
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
