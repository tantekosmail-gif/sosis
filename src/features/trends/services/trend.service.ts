import { supabase } from "@/lib/supabaseClient";

export async function calculateTrends(topicId: string) {
  const { data: keywords } = await supabase
    .from("document_keywords")
    .select("*")
    .limit(1000);

  const map = new Map<string, number>();

  keywords?.forEach((k) => {
    map.set(k.keyword, (map.get(k.keyword) || 0) + 1);
  });

  const trends = Array.from(map.entries()).map(([keyword, count]) => ({
    topic_id: topicId,
    keyword,
    mention_count: count,
    score: count * Math.random(),
    spike_level: count > 50 ? "high" : "low",
  }));

  await supabase.from("trends").insert(trends);

  return trends;
}