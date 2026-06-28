import { useFilterStore } from "@/stores/filterStore";

export function buildExposurePayload() {
  const filter = useFilterStore.getState();

  return {
    analyze_id: process.env.NEXT_PUBLIC_ANALYZE_ID,

    criteria_id: process.env.NEXT_PUBLIC_CRITERIA_ID,

    platform: filter.platform,

    interval: filter.interval,

    type: "",

    filter: JSON.stringify({
      query: {
        bool: {
          must: [
            {
              range: {
                created_at: {
                  gte: new Date(filter.startDate).getTime(),
                  lte: new Date(filter.endDate).getTime(),
                  format: "epoch_millis",
                },
              },
            },
          ],
        },
      },
    }),
  };
}