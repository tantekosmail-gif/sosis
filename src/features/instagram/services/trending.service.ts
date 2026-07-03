import { api } from "@/lib/api";
import type { InstagramTrendingData } from "../types/trending.types";

export async function getInstagramTrending(): Promise<InstagramTrendingData> {
  const { data } = await api.get("/api/v1/instagram/trending");
  return data.data;
}
