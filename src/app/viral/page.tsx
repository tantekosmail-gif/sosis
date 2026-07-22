"use client";

import { Flame } from "lucide-react";

import ComingSoonPage from "@/components/common/ComingSoonPage";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function ViralPage() {
  const { t } = useTranslation();
  return <ComingSoonPage title={t.sidebar.viral} icon={Flame} />;
}
