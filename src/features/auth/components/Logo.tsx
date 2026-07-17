"use client";

import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function Logo() {
  const { t } = useTranslation();
  return (
    <div className="mb-8 text-center">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t.auth.welcomeBack}</h2>
      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
        {t.auth.signInDesc}
      </p>
    </div>
  );
}
