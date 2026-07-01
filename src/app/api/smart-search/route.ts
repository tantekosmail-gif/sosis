import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL;

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const platform = params.get("platform") || "youtube";

  // Forward semua query params kecuali "platform" ke backend
  const forwarded = new URLSearchParams();
  params.forEach((value, key) => {
    if (key !== "platform") forwarded.set(key, value);
  });

  const url = `${BACKEND}/api/v1/${platform}/smart-search?${forwarded.toString()}`;

  try {
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
    });

    const json = await response.json();
    return NextResponse.json(json, { status: response.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const platform = params.get("platform") || "youtube";

  const body = await req.json();
  const url = `${BACKEND}/api/v1/${platform}/smart-search`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await response.json();
    return NextResponse.json(json, { status: response.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
