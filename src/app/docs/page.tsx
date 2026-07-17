"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Compass,
  Globe,
  Home,
  Lightbulb,
  MessageCircle,
  Newspaper,
  Rocket,
  Settings,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import IntroSection from "@/features/docs/sections/IntroSection";
import GettingStartedSection from "@/features/docs/sections/GettingStartedSection";
import OverviewSection from "@/features/docs/sections/OverviewSection";
import PlatformsSection from "@/features/docs/sections/PlatformsSection";
import NewsSection from "@/features/docs/sections/NewsSection";
import CompareSection from "@/features/docs/sections/CompareSection";
import AIChatSection from "@/features/docs/sections/AIChatSection";
import SettingsSection from "@/features/docs/sections/SettingsSection";
import TipsSection from "@/features/docs/sections/TipsSection";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const TAB_META = [
  { key: "intro", icon: BookOpen },
  { key: "start", icon: Rocket },
  { key: "overview", icon: Home },
  { key: "platforms", icon: Compass },
  { key: "news", icon: Newspaper },
  { key: "compare", icon: Globe },
  { key: "ai", icon: MessageCircle },
  { key: "settings", icon: Settings },
  { key: "tips", icon: Lightbulb },
] as const;

type TabKey = (typeof TAB_META)[number]["key"];

const SECTION_COMPONENTS: Record<TabKey, React.ComponentType> = {
  intro: IntroSection,
  start: GettingStartedSection,
  overview: OverviewSection,
  platforms: PlatformsSection,
  news: NewsSection,
  compare: CompareSection,
  ai: AIChatSection,
  settings: SettingsSection,
  tips: TipsSection,
};

export default function DocsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>("intro");
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setAuthChecked(true);
  }, [router]);

  if (!authChecked) return null;

  const active = t.docs.tabs[activeTab];
  const ActiveSection = SECTION_COMPONENTS[activeTab];

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t.docs.title}</h1>
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="w-full lg:w-64 lg:shrink-0">
          <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 shadow-sm lg:flex-col lg:space-y-1 lg:overflow-visible">
            {TAB_META.map((tab) => {
              const Icon = tab.icon;
              const labels = t.docs.tabs[tab.key];
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all lg:w-full ${
                    isActive ? "bg-indigo-600 text-white shadow shadow-indigo-500/30" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-white" : "text-slate-400 dark:text-slate-500"} />
                  <div className="min-w-0">
                    <p className="whitespace-nowrap text-sm font-medium leading-none">{labels.label}</p>
                    <p className={`mt-1 hidden whitespace-nowrap text-[11px] leading-none lg:block ${isActive ? "text-indigo-100" : "text-slate-400 dark:text-slate-500"}`}>
                      {labels.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0 flex-1 space-y-6">
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">{active.label}</h2>
            <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{active.description}</p>
          </div>
          <ActiveSection />
        </div>
      </div>
    </DashboardLayout>
  );
}
