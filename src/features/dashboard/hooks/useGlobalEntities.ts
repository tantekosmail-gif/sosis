"use client";

import { useEffect, useState } from "react";

import { useTopics } from "@/features/topic/hooks/useTopics";
import { getTopicDetail, getTopEntities } from "@/features/topic/services/topic.service";
import { normalizeEntities, mergeEntities, type NormalizedEntity } from "@/lib/entities";

const MAX_TOPICS = 8;
const MAX_KEYWORDS = 25;

// Sama seperti normalizeTopicDetail di app/topics/[id]/page.tsx — GET /search/topics/{id}
// membungkus keyword_id per keyword di data.keyword_details[].keyword_id.
function extractKeywordIds(raw: any): string[] {
  const body = raw?.data ?? raw;
  const groups = body?.keyword_details ?? [];
  return Array.isArray(groups) ? groups.map((g: any) => g.keyword_id).filter(Boolean) : [];
}

export function useGlobalEntities() {
  const { topics, loading: topicsLoading } = useTopics();
  const [entities, setEntities] = useState<NormalizedEntity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (topicsLoading) return;
    if (topics.length === 0) {
      setEntities([]);
      setLoading(false);
      return;
    }
    let cancelled = false;

    (async () => {
      setLoading(true);
      const subsetTopics = topics.slice(0, MAX_TOPICS);
      const detailResults = await Promise.allSettled(
        subsetTopics.map((t) => getTopicDetail(t.id, { limit_per_keyword: 1 }))
      );
      if (cancelled) return;

      detailResults.forEach((r, idx) => {
        if (r.status === "rejected") {
          console.error(`getTopicDetail(${subsetTopics[idx].id}) failed:`, r.reason);
        }
      });

      const keywordIds = detailResults
        .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled")
        .flatMap((r) => extractKeywordIds(r.value))
        .slice(0, MAX_KEYWORDS);

      if (keywordIds.length === 0) {
        console.warn("useGlobalEntities: tidak ada keyword_id ditemukan dari topic detail manapun");
        setEntities([]);
        setLoading(false);
        return;
      }

      const entityResults = await Promise.allSettled(keywordIds.map((kid) => getTopEntities(kid)));
      if (cancelled) return;

      entityResults.forEach((r, idx) => {
        if (r.status === "rejected") {
          console.error(`getTopEntities(${keywordIds[idx]}) failed:`, r.reason);
        }
      });

      const lists = entityResults
        .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled")
        .map((r) => normalizeEntities(r.value));
      setEntities(mergeEntities(lists));
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [topics, topicsLoading]);

  return { entities, loading };
}
