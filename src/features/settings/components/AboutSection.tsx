"use client";

import { Sparkles, GitBranch, ExternalLink, Server, Cpu, Database, Globe } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const STACK = [
  { icon: Globe,    label: "Frontend",    value: "Next.js 16 · React 19 · TypeScript" },
  { icon: Cpu,      label: "State",       value: "Zustand 5 · TanStack Query 5" },
  { icon: Sparkles, label: "AI",          value: "Anthropic Claude API (Haiku 4.5)" },
  { icon: Server,   label: "Backend API", value: process.env.NEXT_PUBLIC_API_URL ?? "http://187.77.125.10:8000" },
  { icon: Database, label: "Charts",      value: "Recharts 3 · ECharts 5 (WordCloud)" },
];

const PLATFORMS = [
  { name: "YouTube",   color: "bg-red-100 text-red-700",       status: "Aktif" },
  { name: "TikTok",    color: "bg-slate-100 text-slate-700",   status: "Aktif" },
  { name: "Instagram", color: "bg-pink-100 text-pink-700",     status: "Aktif" },
  { name: "Facebook",  color: "bg-blue-100 text-blue-700",     status: "Aktif" },
  { name: "Twitter/X", color: "bg-sky-100 text-sky-700",       status: "Aktif" },
  { name: "Berita",    color: "bg-amber-100 text-amber-700",   status: "Aktif" },
];

export default function AboutSection() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      {/* Brand card */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-700 dark:bg-slate-900">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow">
            <Sparkles size={28} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">MediaWatch</h2>
          <p className="mt-1 text-indigo-200 text-sm">AI-Powered Social Media & News Monitoring Platform</p>
          <div className="mt-3 inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
            v0.1.0 · Development
          </div>
        </div>

        <div className="px-6 py-5 text-center">
          <p className="text-sm text-slate-500 leading-relaxed max-w-md mx-auto dark:text-slate-400">
            Platform monitoring media sosial & berita berbasis AI untuk memantau, mencari, dan menganalisis tren serta sentimen publik secara real-time di berbagai platform.
          </p>
        </div>
      </div>

      {/* Tech stack */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-700 dark:bg-slate-900">
        <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{t.settings.about.techStackTitle}</h3>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{t.settings.about.techStackDesc}</p>
        </div>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {STACK.map(({ icon: Icon, label, value }) => (
            <li key={label} className="flex items-center gap-4 px-6 py-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                <Icon size={16} className="text-slate-600 dark:text-slate-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</p>
                <p className="mt-0.5 text-sm text-slate-700 font-mono truncate dark:text-slate-300">{value}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Platforms */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-700 dark:bg-slate-900">
        <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{t.settings.about.platformsTitle}</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 p-6 sm:grid-cols-4">
          {PLATFORMS.map((p) => (
            <div key={p.name} className={`rounded-xl px-4 py-3 text-center ${p.color}`}>
              <p className="font-semibold text-sm">{p.name}</p>
              <p className="mt-0.5 text-[11px] opacity-70">{p.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-700 dark:bg-slate-900">
        <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{t.settings.about.infoTitle}</h3>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {[
            { label: t.settings.about.docs, href: "/docs", icon: ExternalLink },
            { label: t.settings.about.repository, href: "#", icon: GitBranch },
          ].map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors dark:hover:bg-slate-800"
            >
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
              <Icon size={15} className="text-slate-400" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
