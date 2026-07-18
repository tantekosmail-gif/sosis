"use client";

const SENTIMENT_BAR_COLOR: Record<string, string> = {
  positif: "bg-emerald-500",
  netral: "bg-amber-400",
  negatif: "bg-red-500",
};

const SENTIMENT_TEXT_COLOR: Record<string, string> = {
  positif: "text-emerald-600 dark:text-emerald-400",
  netral: "text-amber-600 dark:text-amber-400",
  negatif: "text-red-600 dark:text-red-400",
};

export type SentimentBreakdownEntry = { count?: number; percentage?: number };

export type SentimentBreakdownSummary = {
  positif?: SentimentBreakdownEntry | null;
  netral?: SentimentBreakdownEntry | null;
  negatif?: SentimentBreakdownEntry | null;
};

function formatCompact(n: number) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n?.toString() ?? "0";
}

// Bar komposisi sentimen + baris persentase & jumlah per kelas. Dipakai lintas
// platform (kartu video/post/topik) — semua breakdown API punya bentuk
// {count, percentage} per kelas. Toleran terhadap summary yang absen/tidak
// lengkap; percentage yang hilang diturunkan dari count. Tidak merender apa
// pun kalau datanya kosong.
export default function SentimentBreakdownBar({ summary }: { summary?: SentimentBreakdownSummary | null }) {
  const counts = (["positif", "netral", "negatif"] as const).map((key) => ({
    key,
    count: summary?.[key]?.count ?? 0,
    rawPercentage: summary?.[key]?.percentage,
  }));
  const total = counts.reduce((sum, entry) => sum + entry.count, 0);
  if (total === 0) return null;

  const entries = counts.map((entry) => {
    const percentage = entry.rawPercentage ?? (entry.count / total) * 100;
    return { ...entry, percentage: Math.round(percentage * 10) / 10 };
  });

  return (
    <div className="mt-2">
      <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        {entries.map((entry) =>
          entry.percentage > 0 ? (
            <div
              key={entry.key}
              className={SENTIMENT_BAR_COLOR[entry.key]}
              style={{ width: `${entry.percentage}%` }}
            />
          ) : null
        )}
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[10px] font-medium">
        {entries.map((entry) => (
          <span
            key={entry.key}
            className={`flex items-center gap-1 ${SENTIMENT_TEXT_COLOR[entry.key]}`}
            title={`${entry.count} komentar ${entry.key}`}
          >
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${SENTIMENT_BAR_COLOR[entry.key]}`} />
            <span className="capitalize">{entry.key}</span> {entry.percentage}% ({formatCompact(entry.count)})
          </span>
        ))}
      </div>
    </div>
  );
}
