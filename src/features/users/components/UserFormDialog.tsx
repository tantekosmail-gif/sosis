"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { CreateUserPayload, UpdateUserPayload, UserRecord } from "../services/user.service";

interface UserFormDialogProps {
  mode: "create" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: UserRecord | null;
  loading?: boolean;
  onSubmit: (payload: CreateUserPayload | UpdateUserPayload) => void;
}

export default function UserFormDialog({ mode, open, onOpenChange, initial, loading = false, onSubmit }: UserFormDialogProps) {
  const { t } = useTranslation();
  const su = t.settings.users;

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [isActive, setIsActive] = useState(true);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setEmail(initial?.email ?? "");
    setUsername(initial?.username ?? "");
    setPassword("");
    setShowPassword(false);
    setRole(initial?.role ?? "user");
    setIsActive(initial?.is_active ?? true);
    setIsSuperuser(initial?.is_superuser ?? false);
    setError("");
  }, [open, initial]);

  function handleSubmit() {
    const trimmedEmail = email.trim();
    const trimmedUsername = username.trim();

    if (!trimmedEmail) {
      setError(su.errorEmailRequired);
      return;
    }
    if (!trimmedUsername) {
      setError(su.errorUsernameRequired);
      return;
    }
    if (mode === "create" && password.length < 8) {
      setError(su.errorPasswordLength);
      return;
    }

    setError("");

    if (mode === "create") {
      onSubmit({
        email: trimmedEmail,
        username: trimmedUsername,
        password,
        role: role.trim() || "user",
        is_active: isActive,
      } satisfies CreateUserPayload);
    } else {
      onSubmit({
        email: trimmedEmail,
        username: trimmedUsername,
        role: role.trim() || "user",
        is_active: isActive,
        is_superuser: isSuperuser,
      } satisfies UpdateUserPayload);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? su.createTitle : su.editTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {su.emailLabel}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={su.emailPlaceholder}
              className="h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {su.usernameLabel}
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={su.usernamePlaceholder}
              className="h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            />
          </div>

          {mode === "create" && (
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {su.passwordLabel}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={su.passwordPlaceholder}
                  className="h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 pr-10 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {su.roleLabel}
            </label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder={su.rolePlaceholder}
              list="user-role-suggestions"
              className="h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            />
            <datalist id="user-role-suggestions">
              <option value="user" />
              <option value="editor" />
              <option value="admin" />
            </datalist>
          </div>

          <label className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500/40"
            />
            {su.activeLabel}
          </label>

          {mode === "edit" && (
            <label className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={isSuperuser}
                onChange={(e) => setIsSuperuser(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500/40"
              />
              <span>
                {su.superuserLabel}
                <span className="block text-xs font-normal text-slate-400 dark:text-slate-500">{su.superuserHint}</span>
              </span>
            </label>
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 text-sm font-medium text-slate-600 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {su.cancel}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 text-sm font-medium text-white transition hover:from-indigo-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? su.saving : su.saveButton}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
