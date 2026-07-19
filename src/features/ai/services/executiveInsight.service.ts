export interface ExecutiveInsightPayload {
  topic: string;
  score: number;
  postCount: number;
  sentiment: {
    positif: { count: number; percentage: number };
    netral: { count: number; percentage: number };
    negatif: { count: number; percentage: number };
  };
}

export async function generateExecutiveInsight(payload: ExecutiveInsightPayload) {
  const res = await fetch("/api/ai/executive-insight", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return res.json();
}
