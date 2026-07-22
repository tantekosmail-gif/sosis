"use client";

import { Radio } from "lucide-react";

import ComingSoonPage from "@/components/common/ComingSoonPage";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function LiveStreamerPage() {
  const { t } = useTranslation();
  return <ComingSoonPage title={t.sidebar.liveStreamer} icon={Radio} />;
}
