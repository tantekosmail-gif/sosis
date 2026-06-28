"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = ["#22c55e", "#eab308", "#ef4444"];

interface Props {
  data: {
    sentiment: string;
    total: number;
  }[];
}

export default function SentimentPie({ data }: Props) {
  const safeData = data || [];

  return (
    <div className="bg-white rounded-xl border p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Sentiment</h2>

      <div className="h-80">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={safeData}
              dataKey="total"
              nameKey="sentiment"
              outerRadius={100}
              label
            >
              {safeData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}