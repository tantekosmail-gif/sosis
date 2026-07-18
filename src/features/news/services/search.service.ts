import { api } from "@/lib/api";
import type { NewsSearchData } from "../types/search.types";

export async function searchNews(query: string, limit = 50): Promise<NewsSearchData> {
  const { data } = await api.get<{ data: NewsSearchData }>("/api/v1/news/search", {
    params: { q: query, limit },
  });
  return data.data;
}
