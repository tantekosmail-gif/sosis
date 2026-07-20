import { NextRequest, NextResponse } from "next/server";
import https from "node:https";

// CDN milik Meta (Instagram/Facebook) mengirim header
// Cross-Origin-Resource-Policy: same-origin pada gambarnya. Browser modern
// (Chrome/Firefox) memblokir <img> lintas-origin yang kena header ini, walau
// URL-nya sendiri valid (fetch server-to-server tetap 200) — makanya
// thumbnail Instagram/Facebook gagal tampil walau data & URL-nya benar.
// Endpoint ini mem-fetch ulang gambarnya dari server kita sendiri lalu
// men-stream-kannya sebagai same-origin, supaya CORP tidak lagi memblokir.
//
// Hostname dibatasi ke domain CDN Meta yang diketahui supaya endpoint ini
// tidak jadi open proxy (celah SSRF) untuk URL sembarang.
const ALLOWED_HOST_SUFFIXES = ["cdninstagram.com", "fbcdn.net"];

function isAllowedHost(hostname: string) {
  return ALLOWED_HOST_SUFFIXES.some((suffix) => hostname === suffix || hostname.endsWith(`.${suffix}`));
}

export async function GET(req: NextRequest) {
  const target = req.nextUrl.searchParams.get("url");
  if (!target) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (parsed.protocol !== "https:" || !isAllowedHost(parsed.hostname)) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 400 });
  }

  try {
    const { status, contentType, body } = await fetchViaIPv4(parsed.toString());

    if (status < 200 || status >= 300) {
      return NextResponse.json({ error: "Upstream fetch failed" }, { status: 502 });
    }

    return new NextResponse(new Uint8Array(body), {
      headers: {
        "Content-Type": contentType ?? "image/jpeg",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch (err) {
    console.error("image-proxy failed:", err);
    return NextResponse.json({ error: "Proxy failed" }, { status: 502 });
  }
}

// Node's global fetch() (undici) memakai Happy Eyeballs (coba IPv6 & IPv4
// sekaligus) — di lingkungan yang egress IPv6-nya rusak/tidak ada, ini bisa
// bikin fetch() gantung/timeout walau IPv4-nya sendiri sehat. Modul https
// bawaan Node dengan family:4 memaksa koneksi lewat IPv4 saja, menghindari
// masalah itu sama sekali.
function fetchViaIPv4(url: string): Promise<{ status: number; contentType: string | null; body: Buffer }> {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      { family: 4, headers: { "User-Agent": "Mozilla/5.0" }, timeout: 10_000 },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => {
          resolve({
            status: res.statusCode ?? 0,
            contentType: res.headers["content-type"] ?? null,
            body: Buffer.concat(chunks),
          });
        });
        res.on("error", reject);
      }
    );
    req.on("timeout", () => req.destroy(new Error("Upstream request timed out")));
    req.on("error", reject);
  });
}
