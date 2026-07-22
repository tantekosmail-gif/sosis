"use client";

import { Network } from "lucide-react";

import ComingSoonPage from "@/components/common/ComingSoonPage";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function BuzzerDetectorSnaPage() {
  const { t } = useTranslation();
  return <ComingSoonPage title={t.sidebar.sna} icon={Network} />;
}
