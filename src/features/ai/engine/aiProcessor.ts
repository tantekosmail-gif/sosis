import { supabase } from "@/lib/supabaseClient";

/**
 * CORE AI PIPELINE
 */

function detectClusters(docs: any[]) {
  const keywords = new Map<string, number>();

  docs.forEach((d) => {
    (d.content || "").split(" ").forEach((word: string) => {
      keywords.set(word, (keywords.get(word) || 0) + 1);
    });
  });

  return [
    {
      cluster_name: "Traffic Jakarta",
      centroid_keywords: ["macet", "jakarta", "sudirman"],
      score: 0.91,
    },
  ];
}

function detectAnomaly(docs: any[]) {
  const count = docs.length;

  if (count > 1000) {
    return {
      anomaly_type: "spike",
      metric: "mentions",
      value: count,
      baseline: 300,
      severity: "critical",
    };
  }

  return null;
}

function generateInsight(docs: any[]) {
  return `
Percakapan meningkat signifikan pada topik kemacetan Jakarta.

Penyebab utama:
- Volume kendaraan tinggi
- Proyek jalan
- Jam kerja pagi

Rekomendasi:
- Optimasi rekayasa lalu lintas
- Informasi publik real-time
- Koordinasi Dishub
`;
}


export async function runAIProcessor(topicId: string) {
  const { data: docs } = await supabase
    .from("documents")
    .select("*")
    .eq("topic_id", topicId);

  if (!docs?.length) return;

  // STEP 1: CLUSTERING
  const clusters = detectClusters(docs);

  await supabase.from("topic_clusters").insert(clusters);

  // STEP 2: ANOMALY
  const anomaly = detectAnomaly(docs);

  if (anomaly) {
    await supabase.from("anomalies").insert(anomaly);

    await supabase.from("alerts").insert({
      topic_id: topicId,
      alert_type: "crisis",
      message: "Terjadi lonjakan percakapan tidak normal",
      severity: "high",
    });
  }

  // STEP 3: INSIGHT
  const insight = generateInsight(docs);

  await supabase.from("ai_insights").insert({
    topic_id: topicId,
    insight_type: "summary",
    content: insight,
    confidence: 0.87,
    model: "mock-ai",
  });
}