import { api } from "@/lib/api";

export async function executeAnalyze(payload: any) {
  const { data } = await api.post(
    "/api/v1/analyze/executeQueryByAnalyzeId",
    payload
  );

  return data;
}