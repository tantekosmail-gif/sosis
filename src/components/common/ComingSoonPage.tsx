"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, type LucideIcon } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { hankenGrotesk } from "@/lib/fonts/dashboardFonts";

interface Props {
  title: string;
  icon: LucideIcon;
}

export default function ComingSoonPage({ title, icon: Icon }: Props) {
  const router = useRouter();
  const { t } = useTranslation();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setCheckingAuth(false);
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-24 text-center shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/40">
          <Icon size={26} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className={`${hankenGrotesk.className} text-xl font-bold text-slate-900 dark:text-slate-100`}>
          {title}
        </h1>
        <span className="inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-950/40 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
          {t.common.comingSoonBadge}
        </span>
        <p className="max-w-sm text-sm text-slate-400 dark:text-slate-500">
          {t.common.comingSoonDesc}
        </p>
      </div>
    </DashboardLayout>
  );
}
