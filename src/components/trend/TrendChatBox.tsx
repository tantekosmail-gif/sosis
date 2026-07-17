/**
 * Komponen React yang kirim prompt user ke /api/trend-chat lalu baca NDJSON
 * stream-nya secara live (progress + hasil eksekusi tool + jawaban akhir).
 */
"use client";

import { ChatStreamEvent } from "@/app/api/trend-chat/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Loader2, Search, Send, Wrench } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function TrendChatBox({ onSubmitted }: { onSubmitted?: () => void } = {}) {
  const [prompt, setPrompt] = useState("");
  const [log, setLog] = useState<ChatStreamEvent[]>([]);
  const [busy, setBusy] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  async function handleSubmit() {
    if (!prompt.trim() || busy) return;
    setBusy(true);
    setLog([]);

    try {
      const res = await fetch("/api/trend-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, provider: "claude" }),
      });

      if (!res.body) throw new Error("Tidak ada response body dari server");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? ""; // baris terakhir mungkin belum lengkap

        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as ChatStreamEvent;
          setLog((prev) => [...prev, event]);

          if (
            event.type === "tool_result" &&
            (event.result as { success?: boolean } | undefined)?.success
          ) {
            onSubmitted?.();
          }
        }
      }
    } catch (err) {
      setLog((prev) => [
        ...prev,
        { type: "error", message: err instanceof Error ? err.message : String(err) },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow shadow-indigo-500/25">
          <Search size={16} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Pencarian Topik</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Cari &amp; kirim rekomendasi topik trending</p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {log.length === 0 && (
          <div className="flex h-full min-h-32 flex-col items-center justify-center gap-2 text-center text-slate-300">
            <Search size={22} />
            <p className="text-xs">Mulai dengan mengetik prompt di bawah,
              <br />mis. &quot;cari 10 topik trending soal starbucks hari ini&quot;</p>
          </div>
        )}

        {log.map((event, i) => (
          <div key={i}>
            {event.type === "status" && (
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                <Loader2 size={13} className="animate-spin" />
                {event.message}
              </div>
            )}

            {event.type === "tool_result" && (
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 dark:bg-indigo-950/40 p-3">
                <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-indigo-700">
                  <Wrench size={12} />
                  {event.tool}
                </div>
                <pre className="max-h-56 overflow-auto whitespace-pre-wrap break-words text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                  {JSON.stringify(event.result, null, 2)}
                </pre>
              </div>
            )}

            {event.type === "answer" && (
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-700 dark:text-slate-300">
                {event.text || <span className="text-slate-400 dark:text-slate-500">(tidak ada jawaban)</span>}
              </div>
            )}

            {event.type === "error" && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/40 px-3.5 py-2.5 text-sm text-red-700">
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                {event.message}
              </div>
            )}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>

      <div className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 p-4">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="mis. cari 10 topik trending soal starbucks hari ini"
          disabled={busy}
        />
        <Button onClick={handleSubmit} disabled={busy || !prompt.trim()} size="icon">
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </Button>
      </div>
    </div>
  );
}
