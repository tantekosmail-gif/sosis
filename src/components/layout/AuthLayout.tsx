"use client";

import { ReactNode } from "react";
import { Sparkles, BarChart2, Globe, Shield } from "lucide-react";
import { AppLogo } from "@/components/brand/AppLogo";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const FEATURES = [
  { icon: BarChart2, text: "Real-time sentiment analysis across platforms" },
  { icon: Globe, text: "Multi-platform: YouTube, TikTok, Instagram, Facebook, Twitter/X, News" },
  { icon: Sparkles, text: "AI-powered executive summaries & insights" },
  { icon: Shield, text: "Secure JWT authentication & data privacy" },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] flex-col justify-between bg-slate-900 p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 via-slate-900 to-violet-900/40" />
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-violet-600/10 blur-3xl" />

        <div className="relative z-10">
          {/* Brand */}
          <AppLogo size="lg" theme="dark" showTagline />

          {/* Headline */}
          <div className="mt-16">
            <h1 className="text-4xl font-bold text-white leading-tight">
              {t.auth.heroTitle1}
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                {t.auth.heroTitle2}
              </span>
            </h1>
            <p className="mt-4 text-slate-400 text-lg leading-relaxed max-w-sm">
              {t.auth.heroDesc}
            </p>
          </div>

          {/* Features */}
          <ul className="mt-12 space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                  <Icon size={15} className="text-indigo-400" />
                </div>
                <span className="text-slate-300 text-sm">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-slate-300 text-sm leading-relaxed italic">
              "{t.auth.quote}"
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <AppLogo size="sm" theme="light" className="mb-8 lg:hidden" />

          {children}
        </div>
      </div>
    </div>
  );
}
