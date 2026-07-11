"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LogIn } from "lucide-react";
import { LogoMark } from "@/components/brand/AppLogo";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function NotFound() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 p-6 text-center">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
        <div
          className="absolute inset-0 text-slate-900 opacity-[0.03] dark:text-white dark:opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 p-10 shadow-xl shadow-slate-200/60 backdrop-blur-sm dark:shadow-none">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
          <LogoMark size={30} className="text-white" />
        </div>

        <p className="mt-6 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-8xl font-extrabold leading-none text-transparent">
          404
        </p>

        <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-100">{t.notFound.title}</h1>
        <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">
          {t.notFound.desc}
        </p>

        {pathname && (
          <code className="mt-4 max-w-full truncate rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400">
            {pathname}
          </code>
        )}

        <div className="mt-8 flex w-full flex-wrap items-center justify-center gap-3">
          <Link
            href="/overview"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:from-indigo-700 hover:to-violet-700 hover:shadow-lg"
          >
            <Home size={15} /> {t.notFound.backToOverview}
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 transition hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <LogIn size={15} /> {t.notFound.toLogin}
          </Link>
        </div>
      </div>

      <p className="relative z-10 mt-8 text-xs text-slate-300 dark:text-slate-600">
        MediaWatch — Social Media & News Monitoring
      </p>
    </div>
  );
}
