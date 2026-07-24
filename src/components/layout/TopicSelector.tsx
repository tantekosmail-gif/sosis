"use client";

import { ChevronDown, Tags } from "lucide-react";

import { useTrendRecommendations } from "@/features/keywordRecommendations/hooks/useTrendRecommendations";
import { useTopicStore } from "@/store/topic.store";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Topik terpilih di sini jadi acuan global untuk semua halaman -- sumbernya
// adalah pool Topics, bukan fitur Topics terpisah.
// Disimpan di useTopicStore (id + label, zustand) supaya bisa dibaca dari
// mana saja tanpa prop-drilling, dan tetap sinkron walau AppHeader remount
// tiap navigasi (tiap page.tsx merender ulang DashboardLayout, bukan shared
// root layout). id-nya dipakai halaman lain untuk fetch daftar keyword
// terkait topik ini (GET /trend-recommendations/{id}/keywords).
export default function TopicSelector() {
  const { t } = useTranslation();
  const { items, loading } = useTrendRecommendations();
  const topicId = useTopicStore((s) => s.topicId);
  const topicLabel = useTopicStore((s) => s.topicLabel);
  const setTopic = useTopicStore((s) => s.setTopic);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-9 min-w-0 shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <Tags size={13} className="shrink-0 text-slate-400 dark:text-slate-500" />
          <span className="max-w-[8rem] truncate sm:max-w-[12rem]">
            {topicLabel ?? t.header.selectTopic}
          </span>
          <ChevronDown size={12} className="shrink-0 text-slate-400 dark:text-slate-500" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64">
        {loading ? (
          <div className="px-3 py-4 text-center text-xs text-slate-400 dark:text-slate-500">{t.common.loading}</div>
        ) : !items || items.length === 0 ? (
          <div className="px-3 py-4 text-center text-xs text-slate-400 dark:text-slate-500">{t.header.noTopics}</div>
        ) : (
          items.map((item) => (
            <DropdownMenuItem
              key={item.id}
              onClick={() => setTopic(item.id, item.topic)}
              className={item.id === topicId ? "text-indigo-600 dark:text-indigo-400" : undefined}
            >
              <span className="truncate">{item.topic}</span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
