// "use client";

// import { Globe, MessageCircle, Smile, Users } from "lucide-react";

// import DashboardCard from "./DashboardCard";

// interface Props {
//   data: {
//     total: number;
//     positive: number;
//     neutral: number;
//     negative: number;
//     engagement: number;
//     reach: number;
//     sentimentScore: number;
//   };
// }

// export default function DashboardCardGrid({ data }: Props) {
//   const [item]: any = data;
//   return (
//     <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
//       <DashboardCard
//         title="Total Exposure"
//         value={item?.total_exposure}
//         growth={12}
//         icon={Globe}
//       />

//       <DashboardCard
//         title="Engagement"
//         value={item?.total_engagement}
//         growth={8}
//         icon={MessageCircle}
//       />

//       <DashboardCard
//         title="Reach"
//         value={item?.total_reach}
//         growth={6}
//         icon={Users}
//       />

//       <DashboardCard
//         title="Sentiment Score"
//         value={item?.total_like}
//         growth={3}
//         icon={Smile}
//       />
//     </div>
//   );
// }


"use client";

import {
  Globe,
  MessageCircle,
  Smile,
  Users,
} from "lucide-react";

import DashboardCard from "./DashboardCard";

interface Props {
  data: {
    totalPosts: number;
    totalComments: number;
    engagement: number;
    reach: number;
  };
}

export default function DashboardCardGrid({
  data,
}: Props) {
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