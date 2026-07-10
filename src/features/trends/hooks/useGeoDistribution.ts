"use client";

import { useCallback, useEffect, useState } from "react";

import { getGeoDistribution } from "../services/geoDistribution.service";
import type { GeoDistributionData } from "../types/geoDistribution.types";

export function useGeoDistribution() {
  const [data, setData] = useState<GeoDistributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getGeoDistribution();
      setData(result);
    } catch (err: any) {
      setError(err?.message || "Gagal memuat sebaran lokasi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
