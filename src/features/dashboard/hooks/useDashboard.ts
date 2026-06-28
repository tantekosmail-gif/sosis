"use client";

import { useEffect, useState } from "react";
import { getDashboard } from "../../../../supabase/src/features/dashboard/services/dashboard.service";

export function useDashboard(topicId: string) {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<any>({
    dashboard: [],
    sentiment: [],
    timeline: [],
    topPosts: [],
    wordCloud: [],
  });

  useEffect(() => {
    if (!topicId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await getDashboard(topicId);

        setData({
          dashboard: res?.dashboard ?? {},
          sentiment: res?.sentiment ?? [],
          timeline: res?.timeline ?? [],
          topPosts: res?.topPosts ?? [],
          wordCloud: res?.wordCloud ?? [],
        });
      } catch (err) {
        console.error("Dashboard error:", err);

        // SAFE FALLBACK (BIAR TIDAK CRASH UI)
        setData({
          dashboard: {},
          sentiment: [],
          timeline: [],
          topPosts: [],
          wordCloud: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [topicId]);

  return {
    loading,
    ...data,
  };
}