"use client";

import { useFilterStore } from "@/stores/filterStore";
import AnalyzeButton from "@/components/analysis/AnalyzeButton";
import { Search, CalendarDays, SlidersHorizontal, Globe } from "lucide-react";
import { useState } from "react";

const PLATFORMS = [
  { value: "youtube",   label: "YouTube",   color: "bg-red-500" },
  { value: "tiktok",    label: "TikTok",    color: "bg-slate-900" },
  { value: "instagram", label: "Instagram", color: "bg-gradient-to-br from-pink-500 to-purple-600" },
  { value: "facebook",  label: "Facebook",  color: "bg-blue-600" },
];

export default function FilterBar() {
  const { platform, keyword, startDate, endDate, setPlatform, setKeyword, setStartDate, setEndDate } =
    useFilterStore();
  const [showDate, setShowDate] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Main row */}
      <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-end">
        {/* Platform picker */}
        <div className="flex-1">
          <label className="mb-2.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Platform
          </label>
          <div className="flex flex-wrap gap-2">
            {/* Global (All Platforms) */}
            <button
              onClick={() => setPlatform("global")}
              className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all ${
                platform === "global"
                  ? "border-transparent bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <Globe size={14} />
              Global
              {platform === "global" && (
                <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold">
                  All
                </span>
              )}
            </button>

            <div className="w-px self-stretch bg-slate-200" />

            {PLATFORMS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPlatform(p.value)}
                className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all ${
                  platform === p.value
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span className={`h-2.5 w-2.5 rounded-full ${p.color}`} />
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Keyword */}
        <div className="flex-1 min-w-52">
          <label className="mb-2.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Keyword
          </label>
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Masukkan keyword pencarian..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && document.getElementById("analyze-btn")?.click()}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-end gap-2">
          <div>
            <label className="mb-2.5 block text-xs font-semibold uppercase tracking-wider text-transparent select-none">
              &nbsp;
            </label>
            <button
              onClick={() => setShowDate(!showDate)}
              className={`flex h-10 items-center gap-2 rounded-xl border px-3.5 text-sm font-medium transition-all ${
                showDate
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <CalendarDays size={15} />
              <span className="hidden sm:inline">Filter Tanggal</span>
            </button>
          </div>
          <div>
            <label className="mb-2.5 block text-xs font-semibold uppercase tracking-wider text-transparent select-none">
              &nbsp;
            </label>
            <AnalyzeButton />
          </div>
        </div>
      </div>

      {/* Active date badge */}
      {!showDate && startDate && endDate && (
        <div className="flex items-center gap-2 border-t border-slate-100 bg-indigo-50/60 px-5 py-2.5">
          <CalendarDays size={13} className="text-indigo-500" />
          <span className="text-xs font-medium text-indigo-700">
            Filter aktif: {startDate} — {endDate}
          </span>
          <span className="ml-1 rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">
            Date Search
          </span>
          <button
            onClick={() => { setStartDate(""); setEndDate(""); }}
            className="ml-auto text-[11px] text-indigo-400 hover:text-red-500 transition-colors"
          >
            Hapus filter
          </button>
        </div>
      )}

      {/* Date filter row */}
      {showDate && (
        <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <SlidersHorizontal size={13} />
              Rentang Tanggal
            </div>
            <div className="flex flex-1 flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-500 shrink-0">Dari</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-500 shrink-0">Sampai</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                />
              </div>
              <button
                onClick={() => { setStartDate(""); setEndDate(""); }}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
