import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropicClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const prompt = `Anda adalah Senior Social Media Analyst.

Jawab SELALU menggunakan Bahasa Indonesia.

ATURAN:
- Jangan menggunakan Bahasa Inggris.
- Jangan memberikan penjelasan.
- Jangan menambahkan kalimat pembuka.
- Jangan menggunakan markdown.
- Output HARUS berupa JSON VALID.

Format:

{
  "summary": "ringkasan eksekutif maksimal 2 paragraf",
  "recommendation": "rekomendasi bisnis maksimal 1 paragraf",
  "key_insights": [
    "Insight 1",
    "Insight 2",
    "Insight 3",
    "Insight 4"
  ]
}

Data Analisis:

${JSON.stringify(body)}`;

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text.trim() : "";

    let json;
    try {
      const first = text.indexOf("{");
      const last = text.lastIndexOf("}");
      const cleaned = first !== -1 && last !== -1 ? text.substring(first, last + 1) : text;
      json = JSON.parse(cleaned);
    } catch {
      json = { summary: text, recommendation: "", key_insights: [] };
    }

    return NextResponse.json({
      summary: json.summary ?? "",
      recommendation: json.recommendation ?? "",
      key_insights: Array.isArray(json.key_insights) ? json.key_insights : [],
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
