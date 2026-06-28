import { api } from "@/lib/api";

export async function getDashboard(payload: {
  topicId: string;
  platform: string;
  dateFrom: string;
  dateTo: string;
}) {
  const { data } = await api.get(
    `/api/v1/${payload.platform}/dashboard`,
    {
      params: {
        project_id: payload.topicId,
        date_from: payload.dateFrom,
        date_to: payload.dateTo,
      },
    }
  );

  return data.data;
}