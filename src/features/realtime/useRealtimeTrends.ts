"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useRealtimeTrends(topicId: string) {
  const [trends, setTrends] = useState<any[]>([]);

  useEffect(() => {
    const channel = supabase
      .channel("trends-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "trends",
          filter: `topic_id=eq.${topicId}`,
        },
        (payload) => {
          setTrends((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [topicId]);

  return { trends };
}