import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropicClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const existingKeywords: string[] = Array.isArray(body?.existingKeywords)
      ? body.existingKeywords.filter((k: unknown) => typeof k === "string")
      : [];

    if (!name) {
      return NextResponse.json({ error: "name wajib diisi" }, { status: 400 });
    }

    const prompt = `Anda adalah Social Media Monitoring Analyst.

Berdasarkan nama topik berikut, sarankan keyword pencarian yang relevan untuk memantau
percakapan tentang topik ini di media sosial & berita (mis. nama alternatif, singkatan,
istilah terkait, hashtag umum, tokoh/produk terkait).

Topik: "${name}"
${existingKeywords.length > 0 ? `Keyword yang sudah ada (jangan diulang): ${existingKeywords.join(", ")}` : ""}

ATURAN:
- Jawab dalam Bahasa Indonesia kecuali istilah/nama memang berbahasa Inggris.
- Sarankan maksimal 8 keyword baru, masing-masing singkat (1-4 kata).
- Jangan menyertakan keyword yang sudah ada di daftar di atas.
- Jangan menambahkan penjelasan atau markdown.
- Output HARUS berupa JSON valid dengan format:

{ "keywords": ["keyword1", "keyword2", ...] }`;

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text.trim() : "";

    let keywords: string[] = [];
    try {
      const first = text.indexOf("{");
      const last = text.lastIndexOf("}");
      const cleaned = first !== -1 && last !== -1 ? text.substring(first, last + 1) : text;
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed.keywords)) {
        keywords = parsed.keywords.filter((k: unknown) => typeof k === "string" && k.trim());
      }
    } catch {
      keywords = [];
    }

    const existingLower = new Set(existingKeywords.map((k) => k.toLowerCase()));
    keywords = [...new Set(keywords.map((k) => k.trim()))].filter(
      (k) => !existingLower.has(k.toLowerCase())
    );

    return NextResponse.json({ keywords });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
