"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Sparkles, Settings2, Bell, Info } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import AccountSection from "@/features/settings/components/AccountSection";
import AIModelSection from "@/features/settings/components/AIModelSection";
import ScrapingSection from "@/features/settings/components/ScrapingSection";
import NotificationSection from "@/features/settings/components/NotificationSection";
import AboutSection from "@/features/settings/components/AboutSection";
import { useSettings } from "@/features/settings/hooks/useSettings";

const TABS = [
  { key: "account",      label: "Akun",        icon: User,     description: "Profil & keamanan" },
  { key: "ai",           label: "Model AI",     icon: Sparkles, description: "Provider & konfigurasi" },
  { key: "scraping",     label: "Analisis",     icon: Settings2,description: "Scraping & platform default" },
  { key: "notification", label: "Notifikasi",   icon: Bell,     description: "Preferensi pemberitahuan" },
  { key: "about",        label: "Tentang",      icon: Info,     description: "Informasi aplikasi" },
] as const;

type TabKey = typeof TABS[number]["key"];

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("account");
  const [authChecked, setAuthChecked] = useState(false);
  const { settings, update, save, saved } = useSettings();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { router.replace("/login"); return; }
    setAuthChecked(true);
  }, [router]);

  if (!authChecked) return null;

  const active = TABS.find((t) => t.key === activeTab)!;

  return (
    <DashboardLayout>
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Pengaturan</h1>
        <p className="mt-0.5 text-sm text-slate-400">Kelola akun, konfigurasi AI, dan preferensi aplikasi</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Sidebar nav */}
        <aside className="w-full lg:w-56 lg:shrink-0">
          <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm lg:flex-col lg:space-y-1 lg:overflow-visible">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all lg:w-full ${
                    isActive
                      ? "bg-indigo-600 text-white shadow shadow-indigo-500/30"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-white" : "text-slate-400"} />
                  <div>
                    <p className="whitespace-nowrap text-sm font-medium leading-none">{tab.label}</p>
                    <p className={`mt-0.5 hidden whitespace-nowrap text-[11px] leading-none lg:block ${isActive ? "text-indigo-200" : "text-slate-400"}`}>
                      {tab.description}
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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50">
              <active.icon size={18} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">{active.label}</h2>
              <p className="text-xs text-slate-400">{active.description}</p>
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
          {activeTab === "about" && <AboutSection />}
        </div>
      </div>
    </DashboardLayout>
  );
}
