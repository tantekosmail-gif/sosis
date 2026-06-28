"use client";

import { useAISummary } from "@/features/ai/hooks/useAISummary";

export default function AISummarySection() {
  const { loading, data, run } = useAISummary();

  return (
    <div className="bg-white border rounded-xl p-5">
      <div className="flex justify-between mb-4">
        <h2 className="font-semibold">AI Summary</h2>

        <button
          onClick={() => run("topic-id-demo")}
          className="px-3 py-1 bg-black text-white rounded"
        >
          Generate
        </button>
      </div>

      {loading && <p>Generating insight...</p>}

      {data && (
        <div className="space-y-3">
          <p className="text-sm">{data.summary}</p>

          <div>
            <h3 className="font-medium">Recommendation</h3>
            <p className="text-sm text-gray-600">
              {data.recommendation}
            </p>
          </div>

          <ul className="text-sm list-disc pl-5">
            {data.key_insights?.map((i: string, idx: number) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}