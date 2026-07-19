"use client";

import { Loader2, Sparkles, Wand2 } from "lucide-react";

import { hankenGrotesk, jetBrainsMono } from "@/lib/fonts/dashboardFonts";
import { useExecutiveInsight } from "@/features/ai/hooks/useExecutiveInsight";

interface InsightSentimentEntry {
  count: number;
  percentage: number;
}

export interface ExecutiveInsightTopic {
  topic: string;
  score: number;
  posts: unknown[];
  sentiment: {
    positif: InsightSentimentEntry;
    netral: InsightSentimentEntry;
    negatif: InsightSentimentEntry;
  };
}

const SENTIMENT_LABEL: Record<string, string> = { positif: "positif", netral: "netral", negatif: "negatif" };

function getDominantSentiment(sentiment: ExecutiveInsightTopic["sentiment"]) {
  const total = sentiment.positif.count + sentiment.netral.count + sentiment.negatif.count;
  if (total === 0) return null;
  return (["positif", "netral", "negatif"] as const).reduce((a, b) => (sentiment[b].count > sentiment[a].count ? b : a));
}

export default function ExecutiveInsightCard({ topic }: { topic: ExecutiveInsightTopic }) {
  const dominant = getDominantSentiment(topic.sentiment);
  const dominantPct = dominant ? topic.sentiment[dominant].percentage : 0;
  const { loading, data, generate } = useExecutiveInsight();

  function handleGenerate() {
    generate({
      topic: topic.topic,
      score: topic.score,
      postCount: topic.posts.length,
      sentiment: topic.sentiment,
    });
  }

  const headline = data?.headline || `${topic.topic} Mendominasi Trending`;
  const insight =
    data?.insight ||
    `Topik ini meraih skor ${topic.score.toFixed(1)} dengan ${topic.posts.length} postingan${
      dominant ? ` dan sentimen dominan ${SENTIMENT_LABEL[dominant]} (${dominantPct.toFixed(1)}%)` : ""
    }.`;

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm">
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
            <Sparkles size={12} />
            Executive Insight
          </span>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            title="Buat ringkasan otomatis berdasarkan data topik ini"
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 px-2.5 py-1 text-[11px] font-semibold text-slate-300 transition hover:border-emerald-700 hover:text-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
            {loading ? "Membuat..." : data ? "Buat Ulang" : "Buat Insight"}
          </button>
        </div>

        <h3 className={`${hankenGrotesk.className} mt-3 text-xl font-bold text-white`}>{headline}</h3>

        <p className="mt-2 text-sm leading-relaxed text-slate-400">{insight}</p>
      </div>

      <div className="mt-5 flex items-center gap-6 border-t border-slate-800 pt-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Skor Topik</p>
          <p className={`${jetBrainsMono.className} mt-0.5 text-lg font-medium text-white`}>{topic.score.toFixed(1)}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Sentimen Positif</p>
          <p className={`${jetBrainsMono.className} mt-0.5 text-lg font-medium text-emerald-400`}>
            {topic.sentiment.positif.percentage.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}
