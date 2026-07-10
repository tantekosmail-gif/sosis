"use client";

interface Props {
  data: {
    title: string;
    summary: string;
    issues: string[];
  };
}

export default function AISummaryCard({ data }: Props) {
  return (
    <div className="rounded-2xl border bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          🤖 {data.title}
        </h2>

        <span className="rounded-full bg-blue-50 dark:bg-blue-950/40 px-3 py-1 text-xs font-medium text-blue-600">
          AI Generated
        </span>
      </div>

      <p className="leading-7 text-gray-700">
        {data.summary}
      </p>

      <div className="mt-6">
        <p className="mb-2 font-semibold">
          Top Issues
        </p>

        <div className="flex flex-wrap gap-2">
          {data.issues.map((item) => (
            <span
              key={item}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}