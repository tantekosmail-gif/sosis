"use client";

import { FileDown, Loader2 } from "lucide-react";
import { useExportPDF } from "../hooks/useExportPDF";

interface Props {
  targetId: string;
  keyword?: string;
  platform?: string;
}

export default function ExportButton({ targetId, keyword, platform }: Props) {
  const { exportPDF, exporting } = useExportPDF();

  const filename = `sentimentai-${platform ?? "report"}-${keyword ?? "export"}.pdf`
    .replace(/\s+/g, "-")
    .toLowerCase();

  return (
    <button
      onClick={() => exportPDF(targetId, filename)}
      disabled={exporting}
      className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-indigo-950/40"
    >
      {exporting ? (
        <><Loader2 size={15} className="animate-spin" /> Mengekspor...</>
      ) : (
        <><FileDown size={15} /> Export PDF</>
      )}
    </button>
  );
}
