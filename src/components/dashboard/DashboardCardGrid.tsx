"use client";

import { Globe, MessageCircle, Smile, Users } from "lucide-react";

import DashboardCard from "./DashboardCard";

interface Props {
  data: {
    totalPosts: number;
    totalComments: number;
    engagement: number;
    reach: number;
  };
}

export default function DashboardCardGrid({ data }: Props) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <DashboardCard
        title="Total Posts"
        value={data.totalPosts.toLocaleString()}
        growth={12}
        icon={Globe}
      />

      <DashboardCard
        title="Total Comments"
        value={data.totalComments.toLocaleString()}
        growth={8}
        icon={MessageCircle}
      />

      <DashboardCard
        title="Engagement"
        value={data.engagement.toLocaleString()}
        growth={6}
        icon={Users}
      />

      <DashboardCard
        title="Reach"
        value={data.reach.toLocaleString()}
        growth={3}
        icon={Smile}
      />
    </div>
  );
}
