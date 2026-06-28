"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

import { Card, CardHeader, CardContent } from "@/components/ui/card";

const data = [
  { name: "Instagram", value: 42 },
  { name: "Twitter", value: 31 },
  { name: "TikTok", value: 18 },
  { name: "News", value: 9 },
];

const COLORS = ["#2563eb", "#14b8a6", "#f59e0b", "#ef4444"];

export default function PlatformChart() {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <h2 className="font-semibold">Platform Distribution</h2>
      </CardHeader>

      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                innerRadius={55}
                outerRadius={80}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
