import { api } from "@/lib/api";
import type { GeoDistributionData } from "../types/geoDistribution.types";

export async function getGeoDistribution(params: {
  hours?: number;
  minMentions?: number;
} = {}): Promise<GeoDistributionData> {
  const { data } = await api.get<{ data: GeoDistributionData }>("/api/v1/trend-discovery/geo-distribution", {
    params: {
      hours: params.hours ?? 24,
      min_mentions: params.minMentions ?? 1,
    },
  });

  return data.data;
}
