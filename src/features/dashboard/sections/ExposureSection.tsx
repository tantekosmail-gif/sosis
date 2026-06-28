"use client";

import DashboardCardGrid from "@/components/dashboard/DashboardCardGrid";
import ExposureChart from "@/components/dashboard/ExposureChart";

export default function ExposureSection({
  data,
  timeline,
}: {
  data: any;
  timeline: any;
}) {
  const chartData =
    timeline?.map((item: any) => ({
      date: item.date,
      total: item.exposure,
    })) ?? [];

  return (
    <div className="space-y-6">
      <DashboardCardGrid data={data} />

      <ExposureChart data={chartData} />
    </div>
  );
}
