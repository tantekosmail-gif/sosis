import { api } from "@/lib/api";
import type { NewsTrendingData } from "../types/trending.types";

export async function getNewsTrending(): Promise<NewsTrendingData> {
  const { data } = await api.get<{ data: NewsTrendingData }>("/api/v1/news/trending");
  return data.data;
}
