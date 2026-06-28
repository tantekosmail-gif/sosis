"use client";

import TopPostsTable from "@/components/dashboard/TopPostsTable";

export default function TopPostsSection({
  data,
}: {
  data: any[];
}) {
  return <TopPostsTable data={data || []} />;
}