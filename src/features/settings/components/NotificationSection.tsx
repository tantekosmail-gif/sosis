"use client";

import { CheckCircle2 } from "lucide-react";
import { AppSettings } from "../hooks/useSettings";

interface Props {
  settings: AppSettings;
  update: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  onSave: () => void;
  saved: boolean;
}

function Toggle({
  checked, onChange,
}: {
  checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
        checked ? "bg-indigo-600" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white dark:bg-slate-900 shadow-sm transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function NotifRow({
  title, description, checked, onChange,
}: {
  title: string; description: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{title}</p>
        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export default function NotificationSection({ settings, update, onSave, saved }: Props) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-5">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Preferensi Notifikasi</h3>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">Atur kapan kamu ingin mendapat pemberitahuan dalam aplikasi</p>
        </div>

        <div className="px-6">
          <NotifRow
            title="Analisis Selesai"
            description="Tampilkan notifikasi ketika proses scraping dan analisis data selesai"
            checked={settings.notifyOnAnalysisDone}
            onChange={(v) => update("notifyOnAnalysisDone", v)}
          />
          <NotifRow
            title="AI Summary Selesai"
            description="Tampilkan notifikasi ketika AI berhasil menghasilkan ringkasan eksekutif"
            checked={settings.notifyOnAISummaryDone}
            onChange={(v) => update("notifyOnAISummaryDone", v)}
          />
          <NotifRow
            title="Notifikasi Error"
            description="Tampilkan peringatan ketika terjadi kegagalan koneksi atau error scraping"
            checked={settings.notifyOnError}
            onChange={(v) => update("notifyOnError", v)}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onSave}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow shadow-indigo-500/20 hover:from-indigo-700 hover:to-violet-700 transition"
        >
          {saved ? <><CheckCircle2 size={15} /> Tersimpan!</> : "Simpan Pengaturan"}
        </button>
      </div>
    </div>
  );
}
