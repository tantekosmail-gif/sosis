"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: {
    sentiment: string;
    total: number;
  }[];
}

export default function PlatformChart({ data }: Props) {
console.log(data)

  return (
    <div className="bg-white rounded-xl border p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Platform Distribution</h2>

      <div className="h-80">
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="platform" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


// "use client";

// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// interface Props {
//   data: {
//     sentiment: string;
//     total: number;
//   }[];
// }

// export default function SentimentChart({ data }: Props) {
//   return (
//     <div className="bg-white rounded-xl border p-5 shadow-sm">
//       <h2 className="text-lg font-semibold mb-4">
//         Sentiment Distribution
//       </h2>

//       <div className="h-80">
//         <ResponsiveContainer>
//           <BarChart data={data}>
//             <XAxis dataKey="sentiment" />

//             <YAxis />

//             <Tooltip />

//             <Bar dataKey="total" fill="#8884d8" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// }
