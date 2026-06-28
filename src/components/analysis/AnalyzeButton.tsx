"use client";

import { Button } from "@/components/ui/button";

import { useAnalyze } from "@/features/analysis/hooks/useAnalyze";

import { useFilterStore } from "@/stores/filterStore";

export default function AnalyzeButton() {
  const { execute } = useAnalyze();

  const platform = useFilterStore((s) => s.platform);

  const keyword = useFilterStore((s) => s.keyword);

  async function handleClick() {
    if (!keyword.trim()) {
      alert("Masukkan keyword");

      return;
    }

    await execute(platform, keyword);
  }

  return (
    <Button onClick={handleClick} className="w-full">
      Analyze
    </Button>
  );
}
