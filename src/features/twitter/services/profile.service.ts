import { api } from "@/lib/api";
import type { TwitterProfileData } from "../types/posts.types";

export async function getTwitterProfile(params: { username: string }): Promise<TwitterProfileData> {
  const { data } = await api.get("/api/v1/twitter/profile", {
    params: { username: params.username },
  });

  return data.data ?? data;
}
