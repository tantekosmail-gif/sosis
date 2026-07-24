"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import KeywordRecommendationsSection from "@/features/settings/components/KeywordRecommendationsSection";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function KeywordRecommendationsPage() {
  const { t } = useTranslation();

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          {t.sidebar.topics}
        </h1>
      </div>

      <div className="mt-6">
        <KeywordRecommendationsSection />
      </div>
    </DashboardLayout>
  );
}
