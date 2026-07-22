"use client";

import { Locate } from "lucide-react";

import ComingSoonPage from "@/components/common/ComingSoonPage";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function VideoTrackingPage() {
  const { t } = useTranslation();
  return <ComingSoonPage title={t.sidebar.videoTracking} icon={Locate} />;
}
