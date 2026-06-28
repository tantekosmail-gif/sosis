"use client";

import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  value: string | number;
  growth?: number;
  icon: LucideIcon;
}

export default function DashboardCard({
  title,
  value,
  growth,
  icon: Icon,
}: Props) {
  const positive = (growth ?? 0) >= 0;

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            {value}
          </h2>

          {growth !== undefined && (
            <div
              className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                positive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {positive ? "+" : ""}
              {growth}%
            </div>
          )}

        </div>

        <div className="rounded-xl bg-blue-50 p-3">

          <Icon className="h-6 w-6 text-blue-600" />

        </div>

      </div>

    </div>
  );
}