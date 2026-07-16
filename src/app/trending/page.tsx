"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import TrendingPublicView from "@/components/trending-public/TrendingPublicView";

function TrendingPageContent() {
  const searchParams = useSearchParams();
  const geo = (searchParams.get("geo") || "ID").toUpperCase();

  return <TrendingPublicView geo={geo} />;
}

export default function TrendingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
          <Loader2 size={26} className="animate-spin text-indigo-500" />
        </div>
      }
    >
      <TrendingPageContent />
    </Suspense>
  );
}
