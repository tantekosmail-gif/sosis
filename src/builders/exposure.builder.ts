interface ExposurePayload {
  analyzeId: string;
  criteriaId: string;
  platform: string;
  interval: string;
  startDate: number;
  endDate: number;
  keyword?: string;
}

export function buildExposurePayload({
  analyzeId,
  criteriaId,
  platform,
  interval,
  startDate,
  endDate,
  keyword,
}: ExposurePayload) {
  const filter = {
    query: {
      bool: {
        must: [
          {
            range: {
              created_at: {
                gte: startDate,
                lte: endDate,
                format: "epoch_millis",
              },
            },
          },
        ] as any[],
      },
    },
  };

  if (keyword) {
    filter.query.bool.must.push({
      query_string: {
        query: keyword,
      },
    });
  }

  return {
    analyze_id: analyzeId,
    criteria_id: criteriaId,
    platform,
    interval,
    type: "",
    filter: JSON.stringify(filter),
  };
}