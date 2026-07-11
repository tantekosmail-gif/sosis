"use client";

import { useEffect, useState } from "react";

import { useTopics } from "@/features/topic/hooks/useTopics";
import { getTopicMetrics } from "@/features/topic/services/topic.service";

export interface TopicGrowthItem {
  topicId: string;
  topicName: string;
  mentions: number;
  growthPct: number | null;
}

const MAX_TOPICS_CHECKED = 15;

// Bentuk response GET /metrics/topic/{id} terverifikasi dari network tab:
// { success, data: { metrics: { mentions: {value}, mention_growth: {value}, ... } } }
// — semua metrik nested di data.metrics.<nama>.value, bukan field datar.
function normalizeTopicMetrics(raw: any): { mentions: number; growthPct: number | null } {
  const metrics = raw?.data?.metrics ?? raw?.metrics ?? {};
  const mentions = metrics?.mentions?.value ?? 0;
  const growthRaw = metrics?.mention_growth?.value;
  return { mentions, growthPct: typeof growthRaw === "number" ? growthRaw : null };
}

export function useTopicGrowth() {
  const { topics, loading: topicsLoading } = useTopics();
  const [items, setItems] = useState<TopicGrowthItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (topicsLoading) return;
    if (topics.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }
    let cancelled = false;

    (async () => {
      setLoading(true);
      const subset = topics.slice(0, MAX_TOPICS_CHECKED);
      const results = await Promise.allSettled(subset.map((t) => getTopicMetrics(t.id)));
      if (cancelled) return;

      results.forEach((r, idx) => {
        if (r.status === "rejected") {
          console.error(`getTopicMetrics(${subset[idx].id}) failed:`, r.reason);
        }
      });

      const normalized = results
        .map((r, idx) => {
          if (r.status !== "fulfilled") return null;
          const { mentions, growthPct } = normalizeTopicMetrics(r.value);
          return { topicId: subset[idx].id, topicName: subset[idx].name, mentions, growthPct };
        })
        .filter((x): x is TopicGrowthItem => x !== null);

      setItems(normalized);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [topics, topicsLoading]);

  return { items, loading };
}
