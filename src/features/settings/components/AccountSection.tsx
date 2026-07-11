"use client";

import { useEffect, useState } from "react";
import { User, Mail, Shield, KeyRound, Eye, EyeOff, Save } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

interface UserProfile {
  username: string;
  email: string;
  role: string;
}

export default function AccountSection() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState<UserProfile>({ username: "", email: "", role: "" });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setProfile(JSON.parse(stored));
    } catch {}
  }, []);

  function saveProfile() {
    localStorage.setItem("user", JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6">
      {/* Profile */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-700 dark:bg-slate-900">
        <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{t.settings.account.profileTitle}</h3>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{t.settings.account.profileDesc}</p>
        </div>

        <div className="px-6 py-6 space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl font-bold text-white shadow shadow-indigo-500/30">
              {(profile.username || "A").charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{profile.username || "Administrator"}</p>
              <p className="text-sm text-slate-400 dark:text-slate-500">{profile.role || "Administrator"}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Username */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{t.settings.account.username}</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={profile.username}
                  onChange={(e) => setProfile((p) => ({ ...p, username: e.target.value }))}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:bg-slate-900"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{t.settings.account.email}</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={profile.email}
                  onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:bg-slate-900"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{t.settings.account.role}</label>
              <div className="relative">
                <Shield size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                  value={profile.role}
                  onChange={(e) => setProfile((p) => ({ ...p, role: e.target.value }))}
                  className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:bg-slate-900"
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Analyst">Analyst</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={saveProfile}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow shadow-indigo-500/20 hover:from-indigo-700 hover:to-violet-700 transition"
            >
              <Save size={15} />
              {saved ? t.common.saved : t.settings.account.saveProfile}
            </button>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-700 dark:bg-slate-900">
        <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{t.settings.account.passwordTitle}</h3>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{t.settings.account.passwordDesc}</p>
        </div>

        <div className="px-6 py-6 space-y-4">
          {/* Old password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{t.settings.account.oldPassword}</label>
            <div className="relative">
              <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showOld ? "text" : "password"}
                value={oldPw}
                onChange={(e) => setOldPw(e.target.value)}
                placeholder="••••••••"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-800 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:bg-slate-900"
              />
              <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                {showOld ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* New password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{t.settings.account.newPassword}</label>
            <div className="relative">
              <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showNew ? "text" : "password"}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="••••••••"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-800 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:bg-slate-900"
              />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {newPw.length > 0 && newPw.length < 8 && (
              <p className="mt-1.5 text-xs text-amber-500">Password minimal 8 karakter</p>
            )}
          </div>

          <div className="flex justify-end pt-1">
            <button
              disabled={!oldPw || newPw.length < 8}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              <KeyRound size={15} />
              {t.settings.account.changePassword}
            </button>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-red-200 bg-red-50/40 shadow-sm overflow-hidden dark:bg-red-950/40">
        <div className="border-b border-red-100 px-6 py-5">
          <h3 className="font-semibold text-red-700">{t.settings.account.dangerZoneTitle}</h3>
          <p className="mt-0.5 text-xs text-red-400">{t.settings.account.dangerZoneDesc}</p>
        </div>
        <div className="flex items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.settings.account.logoutAllTitle}</p>
            <p className="text-xs text-slate-400 mt-0.5 dark:text-slate-500">Menghapus semua token autentikasi yang tersimpan</p>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition dark:bg-slate-900 dark:hover:bg-red-950/40"
          >
            {t.settings.account.logoutAllButton}
          </button>
        </div>
      </div>
    </div>
  );
}
