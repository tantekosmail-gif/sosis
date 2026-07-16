"use client";

import { Loader2, Zap } from "lucide-react";
import { toast } from "sonner";
import { useAnalyze } from "@/features/analysis/hooks/useAnalyze";
import { useFilterStore } from "@/stores/filterStore";
import { useDashboardStore } from "@/store/dashboard.store";

export default function AnalyzeButton() {
  const { execute } = useAnalyze();
  const platform = useFilterStore((s) => s.platform);
  const keyword = useFilterStore((s) => s.keyword);
  const loading = useDashboardStore((s) => s.loading);

  async function handleClick() {
    if (!keyword.trim()) {
      toast.error("Masukkan keyword");
      return;
    }
    await execute(platform, keyword);
  }

  return (
    <button
      id="analyze-btn"
      onClick={handleClick}
      disabled={loading}
      className="flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:from-indigo-700 hover:to-violet-700 hover:shadow-lg hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Zap size={16} />
      )}
      {loading ? "Analyzing..." : "Analyze"}
    </button>
  );
}
