"use client";

import FilterBar from "@/components/filters/FilterBar";

export default function AnalysisPanel() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border p-5 mb-6 space-y-4">
      <FilterBar />
    </div>
  );
}
