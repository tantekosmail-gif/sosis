import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropicClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const prompt = `Anda adalah Senior Social Media Analyst yang menulis ringkasan eksekutif untuk dashboard monitoring.

Jawab SELALU menggunakan Bahasa Indonesia.

ATURAN:
- Jangan menggunakan Bahasa Inggris.
- Jangan memberikan penjelasan tambahan.
- Jangan menambahkan kalimat pembuka.
- Jangan menggunakan markdown.
- HANYA gunakan data yang diberikan di bawah -- jangan mengarang angka, tren, atau fakta yang tidak ada di data.
- Output HARUS berupa JSON VALID.

Format:

{
  "headline": "judul singkat gaya headline eksekutif, maksimal 8 kata",
  "insight": "narasi analisis maksimal 2 paragraf pendek, berdasarkan data di bawah"
}

Data topik trending:

${JSON.stringify(body)}`;

    const message = await anthropic.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    const text = textBlock && textBlock.type === "text" ? textBlock.text.trim() : "";

    let json;
    try {
      const first = text.indexOf("{");
      const last = text.lastIndexOf("}");
      const cleaned = first !== -1 && last !== -1 ? text.substring(first, last + 1) : text;
      json = JSON.parse(cleaned);
    } catch {
      json = { headline: "", insight: text };
    }

    return NextResponse.json({
      headline: json.headline ?? "",
      insight: json.insight ?? "",
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
