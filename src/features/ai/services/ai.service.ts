import { supabase } from "@/lib/supabaseClient";

/**
 * Generate AI Summary per topic
 */

function buildPrompt(docs: any[]) {
  return `
Analisis percakapan berikut:

Total data: ${docs.length}

Topik: kemacetan lalu lintas

Buat:
1. summary
2. insight
3. recommendation

Data:
${docs.map((d) => `- ${d.content}`).join("\n")}
`;
}

function fakeAI(prompt: string) {
  return {
    summary:
      "Percakapan meningkat signifikan terkait kemacetan di Jakarta, terutama di platform Facebook dan TikTok.",

    recommendation:
      "Perkuat komunikasi publik terkait rekayasa lalu lintas dan update real-time kondisi jalan.",

    insights: [
      "Facebook menyumbang 45% percakapan",
      "Sentimen negatif meningkat 22%",
      "Isu utama: Sudirman & Gatot Subroto",
    ],
  };
}

export async function generateAISummary(topicId: string) {
  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("topic_id", topicId)
    .limit(200);

  if (!documents?.length) return null;

  const prompt = buildPrompt(documents);

  // SIMULASI AI (nanti bisa ganti OpenAI / Gemini)
  const result = fakeAI(prompt);

  const { data } = await supabase
    .from("ai_summaries")
    .insert({
      topic_id: topicId,
      summary: result.summary,
      recommendation: result.recommendation,
      key_insights: result.insights,
    })
    .select()
    .single();

  return data;
}
