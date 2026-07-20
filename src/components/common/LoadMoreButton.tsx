"use client";

import { ChevronDown } from "lucide-react";

import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function LoadMoreButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label?: string;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex justify-center mt-5">
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-2 rounded-xl border border-emerald-200 dark:border-emerald-900 px-5 py-2.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 transition hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
      >
        {label ?? t.common.loadMore}
        <ChevronDown size={15} />
      </button>
    </div>
  );
}
