"use client";

import { useState } from "react";
import { Sparkles, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { AppSettings } from "../hooks/useSettings";

interface Props {
  settings: AppSettings;
  update: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  onSave: () => void;
  saved: boolean;
}

export default function AIModelSection({ settings, update, onSave, saved }: Props) {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="space-y-6">
      {/* Provider info */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-5">
          <h3 className="font-semibold text-slate-900">Provider AI</h3>
          <p className="mt-0.5 text-xs text-slate-400">Model yang digunakan untuk Generate AI Summary</p>
        </div>
        <div className="px-6 py-6">
          <div className="flex items-start gap-4 rounded-2xl border-2 border-violet-500 bg-violet-50/60 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Claude API <span className="ml-2 inline-block rounded-lg bg-violet-100 px-2 py-0.5 text-[11px] font-semibold text-violet-700">Aktif</span></p>
              <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                Menggunakan <span className="font-mono text-xs bg-slate-100 px-1 rounded">claude-haiku-4-5-20251001</span> dari Anthropic — cepat dan akurat untuk analisis Bahasa Indonesia.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Claude API Key */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-5">
          <h3 className="font-semibold text-slate-900">Konfigurasi Claude API</h3>
          <p className="mt-0.5 text-xs text-slate-400">API key untuk akses Anthropic Claude</p>
        </div>
        <div className="px-6 py-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Anthropic API Key</label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={settings.anthropicApiKey}
                onChange={(e) => update("anthropicApiKey", e.target.value)}
                placeholder="sk-ant-api03-..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-3.5 pr-10 text-sm text-slate-800 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-slate-400">
              Untuk production, tambahkan <code className="font-mono bg-slate-100 px-1 rounded">ANTHROPIC_API_KEY</code> di <code className="font-mono bg-slate-100 px-1 rounded">.env.local</code>.
            </p>
          </div>

          <div className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-xs text-violet-700 leading-relaxed">
            API key yang dimasukkan di sini hanya disimpan di browser (localStorage) dan tidak dikirim ke server. Gunakan environment variable untuk keamanan production.
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={onSave}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow shadow-indigo-500/20 hover:from-indigo-700 hover:to-violet-700 transition"
        >
          {saved ? <><CheckCircle2 size={15} /> Tersimpan!</> : "Simpan Pengaturan AI"}
        </button>
      </div>
    </div>
  );
}
