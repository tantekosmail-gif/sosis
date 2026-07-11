"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTopics } from "@/features/topic/hooks/useTopics";
import { generateReport } from "@/features/topic/services/topic.service";

const FORMAT_OPTIONS = [
  { key: "pdf", label: "PDF" },
  { key: "docx", label: "DOCX" },
  { key: "json", label: "JSON" },
] as const;

type Format = (typeof FORMAT_OPTIONS)[number]["key"];

export default function ExportReportButton() {
  const { topics } = useTopics();
  const [open, setOpen] = useState(false);
  const [topicId, setTopicId] = useState("");
  const [format, setFormat] = useState<Format>("pdf");
  const [submitting, setSubmitting] = useState(false);

  async function handleGenerate() {
    if (!topicId) {
      toast.error("Pilih topik dulu");
      return;
    }
    setSubmitting(true);
    try {
      const result = await generateReport({ topic_id: topicId, format });
      console.log("generateReport result:", result);
      toast.success("Permintaan laporan terkirim, cek status job di server.");
      setOpen(false);
    } catch (err: any) {
      // Endpoint ini belum diverifikasi field request-nya secara pasti — kalau
      // gagal, pesan error dari backend (biasanya 422 per-field) ditampilkan
      // apa adanya supaya bisa diperbaiki mapping-nya. Body error kadang kosong
      // ({}), jadi selalu sertakan status code sebagai fallback supaya toast-nya
      // tetap ada info yang bisa dilaporkan balik, bukan cuma pesan generik.
      const status = err?.response?.status;
      const backendMessage =
        err?.response?.data?.error?.message || err?.response?.data?.message || err?.message;
      const message = backendMessage
        ? status
          ? `(${status}) ${backendMessage}`
          : backendMessage
        : status
        ? `Gagal membuat laporan (HTTP ${status})`
        : "Gagal membuat laporan";
      toast.error(message);
      // console.warn (bukan console.error) supaya tidak memicu overlay error
      // dev Next.js untuk kondisi yang sudah ditangani (toast sudah tampil).
      console.warn("generateReport failed:", {
        status,
        statusText: err?.response?.statusText,
        data: err?.response?.data,
        requestUrl: err?.config?.url,
        requestBody: err?.config?.data,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 text-sm font-medium text-slate-600 dark:text-slate-400 transition hover:bg-slate-50 dark:hover:bg-slate-800"
      >
        <FileDown size={15} />
        Export Laporan
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Laporan</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Topik
              </label>
              <select
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 text-sm text-slate-800 dark:text-slate-200 focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
              >
                <option value="">Pilih topik...</option>
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Format
              </label>
              <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
                {FORMAT_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setFormat(opt.key)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                      format === opt.key ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={submitting || !topicId}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? <Loader2 size={15} className="animate-spin" /> : <FileDown size={15} />}
              Generate
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
