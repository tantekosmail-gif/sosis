import { api } from "@/lib/api";
import type { FacebookProfileData } from "../types/posts.types";

export async function getFacebookProfile(params: { username: string }): Promise<FacebookProfileData> {
  const { data } = await api.get("/api/v1/facebook/profile", {
    params: { username: params.username },
  });

  return data.data ?? data;
}
