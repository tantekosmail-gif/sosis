import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const project_id = searchParams.get("project_id");
  const date_from = searchParams.get("date_from");
  const date_to = searchParams.get("date_to");

  const res = await fetch(
    `${process.env.BACKEND_URL}/api/v1/youtube/dashboard?project_id=${project_id}&date_from=${date_from}&date_to=${date_to}`
  );

  const data = await res.json();

  return NextResponse.json(data);
}