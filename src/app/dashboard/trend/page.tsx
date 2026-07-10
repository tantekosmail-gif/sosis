"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { TrendChatBox } from "@/components/trend/TrendChatBox";
import { TrendRecommendationsList } from "@/components/trend/TrendRecommendationsList";
import { useTrendRecommendations } from "@/features/trends/hooks/useTrendRecommendations";

export default function TrendChatPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const recommendations = useTrendRecommendations();

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
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <h1 className="text-xl font-bold text-slate-800">Cari Topik AI</h1>
        <p className="mt-1 text-sm text-slate-400">
          Chat dengan AI untuk mencari &amp; mengirim rekomendasi topik trending
        </p>

        <div className="mt-6 grid h-[calc(100vh-13rem)] grid-cols-1 gap-6 lg:grid-cols-2">
          <TrendChatBox onSubmitted={recommendations.refetch} />
          <TrendRecommendationsList
            data={recommendations.data}
            loading={recommendations.loading}
            error={recommendations.error}
            limit={recommendations.limit}
            onLimitChange={recommendations.setLimit}
            onRefresh={recommendations.refetch}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
