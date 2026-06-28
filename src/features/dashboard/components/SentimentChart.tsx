"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  Tooltip,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

import { trendData } from "../mocks/chart";

export default function SentimentChart() {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="flex flex-row justify-between">

        <div>

          <h2 className="text-xl font-semibold">
            Sentiment Trend
          </h2>

          <p className="text-muted-foreground">
            Last 30 Days
          </p>

        </div>

        <div className="text-right">

          <p className="text-4xl font-bold">
            82%
          </p>

          <span className="text-green-600">
            ↑ 4.3%
          </span>

        </div>

      </CardHeader>

      <CardContent>

        <div className="h-[300px]">

          <ResponsiveContainer>

            <AreaChart data={trendData}>

              <defs>

                <linearGradient id="gradient">

                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />

                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />

                </linearGradient>

              </defs>

              <CartesianGrid
                vertical={false}
                strokeDasharray="4"
              />

              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
              />

              <Tooltip />

              <Area
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={3}
                fill="url(#gradient)"
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

        <div className="grid grid-cols-3 gap-4 mt-8">

          <div>

            <p className="text-muted-foreground">
              Positive
            </p>

            <h3 className="text-2xl font-bold">
              82%
            </h3>

          </div>

          <div>

            <p className="text-muted-foreground">
              Neutral
            </p>

            <h3 className="text-2xl font-bold">
              13%
            </h3>

          </div>

          <div>

            <p className="text-muted-foreground">
              Negative
            </p>

            <h3 className="text-2xl font-bold">
              5%
            </h3>

          </div>

        </div>

      </CardContent>

    </Card>
  );
}