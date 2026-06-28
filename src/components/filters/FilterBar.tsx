"use client";

import { useFilterStore } from "@/stores/filterStore";
import AnalyzeButton from "@/components/analysis/AnalyzeButton";

export default function FilterBar() {
  const {
    platform,
    keyword,
    startDate,
    endDate,

    setPlatform,
    setKeyword,
    setStartDate,
    setEndDate,
  } = useFilterStore();

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* PLATFORM */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-600">
            Platform
          </label>

          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
          >
            <option value="youtube">YouTube</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
          </select>
        </div>

        {/* KEYWORD */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-600">
            Keyword
          </label>

          <input
            placeholder="Masukkan keyword..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
          />
        </div>

        {/* DATE FROM */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-600">
            Date From
          </label>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
          />
        </div>

        {/* DATE TO */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-600">
            Date To
          </label>

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-xl border px-3 py-2"
          />
        </div>

        {/* BUTTON */}
        <div className="flex items-end">
          <AnalyzeButton />
        </div>
      </div>
    </div>
  );
}
