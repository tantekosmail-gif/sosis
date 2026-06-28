"use client";

import { useRealtimeTrends } from "@/features/realtime/useRealtimeTrends";

export default function TrendSection() {
  const { trends } = useRealtimeTrends("topic-id-demo");

  return (
    <div className="bg-white border rounded-xl p-5">
      <h2 className="font-semibold mb-4">🔥 Trending Topics</h2>

      <div className="space-y-2">
        {trends.map((t, i) => (
          <div
            key={i}
            className="flex justify-between text-sm border-b pb-2"
          >
            <span>{t.keyword}</span>

            <span className="font-medium">
              {t.mention_count} mentions
            </span>

            <span className="text-xs text-gray-500">
              {t.spike_level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}