"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export type SentimentKind = "positive" | "neutral" | "negative";

export const SENTIMENT_LABEL_ID: Record<SentimentKind, string> = {
  positive: "Positif",
  neutral: "Netral",
  negative: "Negatif",
};

const SENTIMENT_BADGE_STYLE: Record<SentimentKind, string> = {
  positive: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
  neutral: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
  negative: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300",
};

export interface InfoSourceRequest {
  /** Nama informasi yang diklik, mis. "Sentimen Positif". */
  title: string;
  /** Nilai yang sedang ditampilkan, sudah terformat. */
  value?: string;
  /** Kalau informasi ini bernuansa sentimen, tampilkan label berwarnanya. */
  sentiment?: SentimentKind;
  /** Arti informasi dalam bahasa awam. */
  meaning: string;
  /** Dari mana datanya berasal, dalam bahasa awam (bukan istilah teknis). */
  source: string;
  /** Catatan tambahan opsional. */
  note?: string;
}

interface InfoSourceContextValue {
  explain: (request: InfoSourceRequest) => void;
}

const InfoSourceContext = createContext<InfoSourceContextValue | null>(null);

export function useInfoSource(): InfoSourceContextValue {
  const ctx = useContext(InfoSourceContext);
  // Komponen bisa dirender di luar provider — klik penjelasan jadi no-op alih-alih crash.
  return ctx ?? { explain: () => {} };
}

export const INFO_HINT = "Klik untuk lihat arti & sumber data";

export function InfoSourceProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<InfoSourceRequest | null>(null);

  const explain = useCallback((req: InfoSourceRequest) => setRequest(req), []);
  const value = useMemo(() => ({ explain }), [explain]);

  return (
    <InfoSourceContext.Provider value={value}>
      {children}

      <Dialog open={!!request} onOpenChange={(open) => !open && setRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex flex-wrap items-center gap-2">
              {request?.title}
              {request?.sentiment && (
                <span
                  className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold ${SENTIMENT_BADGE_STYLE[request.sentiment]}`}
                >
                  {SENTIMENT_LABEL_ID[request.sentiment]}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          {request && (
            <div className="space-y-4">
              {request.value !== undefined && (
                <p className="text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100">{request.value}</p>
              )}

              <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Artinya
                </p>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{request.meaning}</p>
              </div>

              <div>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Sumber data
                </p>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{request.source}</p>
              </div>

              {request.note && (
                <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-400">{request.note}</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </InfoSourceContext.Provider>
  );
}
