"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { PLATFORM_SNAPSHOTS } from "@/features/socialSnapshot/config/platforms";
import PlatformSnapshotCard from "@/features/socialSnapshot/components/PlatformSnapshotCard";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function SocialSnapshotPage() {
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
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.common.checkingAuth}</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t.socialSnapshot.title}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.socialSnapshot.subtitle}</p>
        </div>

        <div className="space-y-4">
          {PLATFORM_SNAPSHOTS.map((config) => (
            <PlatformSnapshotCard key={config.key} config={config} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
