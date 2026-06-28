"use client";

import PlatformChart from "@/components/dashboard/PlatformChart";
import SentimentPie from "@/components/dashboard/SentimentPie";

export default function SentimentSection({
  data,
  platform,
}: {
  data: any[];
  platform: any[];
}) {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <SentimentPie data={data} />
      <PlatformChart data={platform} />
    </div>
  );
}
