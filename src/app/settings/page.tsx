"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Sparkles, Settings2, Bell, Info, LayoutGrid } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import AccountSection from "@/features/settings/components/AccountSection";
import AIModelSection from "@/features/settings/components/AIModelSection";
import ScrapingSection from "@/features/settings/components/ScrapingSection";
import NotificationSection from "@/features/settings/components/NotificationSection";
import OverviewWidgetsSection from "@/features/settings/components/OverviewWidgetsSection";
import AboutSection from "@/features/settings/components/AboutSection";
import { useSettings } from "@/features/settings/hooks/useSettings";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const TABS = [
  { key: "account",      icon: User },
  { key: "ai",           icon: Sparkles },
  { key: "scraping",     icon: Settings2 },
  { key: "notification", icon: Bell },
  { key: "widgets",      icon: LayoutGrid },
  { key: "about",        icon: Info },
] as const;

type TabKey = typeof TABS[number]["key"];

export default function SettingsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>("account");
  const [authChecked, setAuthChecked] = useState(false);
  const { settings, update, save, saved } = useSettings();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { router.replace("/login"); return; }
    setAuthChecked(true);
  }, [router]);

  if (!authChecked) return null;

  const active = TABS.find((tab) => tab.key === activeTab)!;
  const activeLabels = t.settings.tabs[active.key];

  return (
    <DashboardLayout>
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t.settings.title}</h1>
        <p className="mt-0.5 text-sm text-slate-400 dark:text-slate-500">{t.settings.subtitle}</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Sidebar nav */}
        <aside className="w-full lg:w-56 lg:shrink-0">
          <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 shadow-sm lg:flex-col lg:space-y-1 lg:overflow-visible">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const labels = t.settings.tabs[tab.key];
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all lg:w-full ${
                    isActive
                      ? "bg-indigo-600 text-white shadow shadow-indigo-500/30"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-white" : "text-slate-400 dark:text-slate-500"} />
                  <div>
                    <p className="whitespace-nowrap text-sm font-medium leading-none">{labels.label}</p>
                    <p className={`mt-0.5 hidden whitespace-nowrap text-[11px] leading-none lg:block ${isActive ? "text-indigo-200" : "text-slate-400 dark:text-slate-500"}`}>
                      {labels.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Section header */}
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40">
              <active.icon size={18} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">{activeLabels.label}</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">{activeLabels.description}</p>
            </div>
          </div>

          {activeTab === "account" && <AccountSection />}
          {activeTab === "ai" && (
            <AIModelSection settings={settings} update={update} onSave={save} saved={saved} />
          )}
          {activeTab === "scraping" && (
            <ScrapingSection settings={settings} update={update} onSave={save} saved={saved} />
          )}
          {activeTab === "notification" && (
            <NotificationSection settings={settings} update={update} onSave={save} saved={saved} />
          )}
          {activeTab === "widgets" && (
            <OverviewWidgetsSection settings={settings} update={update} onSave={save} saved={saved} />
          )}
          {activeTab === "about" && <AboutSection />}
        </div>
      </div>
    </DashboardLayout>
  );
}
