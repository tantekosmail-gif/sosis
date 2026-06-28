"use client";

import DashboardCardGrid from "@/components/dashboard/DashboardCardGrid";
import ExposureChart from "@/components/dashboard/ExposureChart";

interface Props {
  data: any;
  timeline: any[];
}

export default function ExposureSection({
  data,
  timeline,
}: Props) {

  const chartData =
    timeline?.map((item) => ({
      date: item.date,
      total: item.total,
    })) ?? [];

  return (
    <div className="space-y-6">

      <DashboardCardGrid
        data={data}
      />

      <ExposureChart
        data={chartData}
      />

    </div>
  );
}