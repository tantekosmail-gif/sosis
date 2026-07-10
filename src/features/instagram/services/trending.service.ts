import { api } from "@/lib/api";
import type { InstagramTrendingData } from "../types/trending.types";

export async function getInstagramTrending(params: {
  dateFrom?: string;
  dateTo?: string;
} = {}): Promise<InstagramTrendingData> {
  const { data } = await api.get<{ data: InstagramTrendingData }>("/api/v1/instagram/trending", {
    params: {
      date_from: params.dateFrom || undefined,
      date_to: params.dateTo || undefined,
    },
  });
  return data.data;
}
