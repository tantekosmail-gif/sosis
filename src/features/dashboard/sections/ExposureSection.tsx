"use client";

import DashboardCardGrid from "@/components/dashboard/DashboardCardGrid";
import ExposureChart from "@/components/dashboard/ExposureChart";

interface Props {
  data: any;
  sentiment: any;
  timeline: any[];
}

export default function ExposureSection({ data, sentiment, timeline }: Props) {
  const chartData = timeline?.map((item) => ({ date: item.date, total: item.total })) ?? [];

  return (
    <div className="space-y-6">
      <DashboardCardGrid
        summary={{
          totalComments: data?.totalComments ?? 0,
          reach:         data?.reach         ?? 0,
        }}
        sentiment={{
          positive: sentiment?.positive ?? 0,
          neutral:  sentiment?.neutral  ?? 0,
          negative: sentiment?.negative ?? 0,
        }}
      />
      <ExposureChart data={chartData} />
    </div>
  );
}
