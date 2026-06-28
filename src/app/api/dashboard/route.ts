import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const platform = searchParams.get("platform") || "youtube";
    const project_id = searchParams.get("project_id");
    const date_from = searchParams.get("date_from");
    const date_to = searchParams.get("date_to");
    const keyword = searchParams.get("keyword") || "";

    if (!project_id) {
      return NextResponse.json(
        { error: "project_id is required" },
        { status: 400 }
      );
    }

    // 🔥 PLATFORM ROUTER
    let endpoint = "";

    switch (platform) {
      case "youtube":
        endpoint = "/api/v1/youtube/dashboard";
        break;

      case "tiktok":
        endpoint = "/api/v1/tiktok/dashboard";
        break;

      case "instagram":
        endpoint = "/api/v1/instagram/dashboard";
        break;

      default:
        endpoint = "/api/v1/youtube/dashboard";
    }

    const url = `${BACKEND_URL}${endpoint}?project_id=${project_id}&date_from=${date_from}&date_to=${date_to}&keyword=${keyword}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Backend request failed" },
        { status: 500 }
      );
    }

    const data = await res.json();

    // 🔥 NORMALIZATION LAYER (PENTING BANGET)
    const normalized = normalizeResponse(platform, data);

    return NextResponse.json(normalized);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}

/**
 * 🔥 IMPORTANT: SAMAKAN SEMUA PLATFORM RESPONSE
 */
function normalizeResponse(platform: string, data: any) {
  return {
    platform,

    dashboard: {
      total: data?.total ?? 0,
      engagement: data?.engagement ?? 0,
      reach: data?.reach ?? 0,
    },

    sentiment:
      data?.sentiment ??
      [
        { sentiment: "positive", total: 0 },
        { sentiment: "neutral", total: 0 },
        { sentiment: "negative", total: 0 },
      ],

    timeline: data?.timeline ?? [],

    topPosts: data?.topPosts ?? [],

    wordCloud: data?.wordCloud ?? [],
  };
}