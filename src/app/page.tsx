"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function Home() {
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (token) {
      router.replace("/overview");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">{t.common.loading}</div>
  );
}
