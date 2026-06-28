import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    const params=req.nextUrl.searchParams;

    const backend=process.env.NEXT_PUBLIC_API_URL;

    const url=
        `${backend}/api/v1/youtube/smart-search?${params.toString()}`;

    const response=await fetch(url);

    const json=await response.json();

    return NextResponse.json(json);

}