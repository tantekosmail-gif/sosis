"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Eye, EyeOff, KeyRound, Loader2, Pencil, Search, ShieldAlert, UserPlus, UserX, Users as UsersIcon } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { useUsers } from "../hooks/useUsers";
import { userApiErrorMessage } from "../lib/apiError";
import type { CreateUserPayload, UpdateUserPayload, UserRecord } from "../services/user.service";
import UserFormDialog from "./UserFormDialog";

export default function UsersSection() {
  const { t } = useTranslation();
  const su = t.settings.users;
  const {
    users,
    total,
    offset,
    limit,
    loading,
    error,
    forbidden,
    search,
    nextPage,
    prevPage,
    addUser,
    editUser,
    resetPassword,
    removeUser,
  } = useUsers();

  const [searchInput, setSearchInput] = useState("");
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<UserRecord | null>(null);
  const [passwordTarget, setPasswordTarget] = useState<UserRecord | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<UserRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setCurrentEmail(JSON.parse(stored)?.email ?? null);
    } catch {}
  }, []);

  useEffect(() => {
    const handle = setTimeout(() => search(searchInput.trim()), 350);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  async function handleCreate(payload: CreateUserPayload | UpdateUserPayload) {
    setSubmitting(true);
    try {
      await addUser(payload as CreateUserPayload);
      setCreateOpen(false);
      toast.success(su.createSuccess);
    } catch (err) {
      console.error("createUser failed:", err);
      toast.error(userApiErrorMessage(err, su.createError));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEdit(payload: CreateUserPayload | UpdateUserPayload) {
    if (!editTarget) return;
    setSubmitting(true);
    try {
      await editUser(editTarget.id, payload as UpdateUserPayload);
      setEditTarget(null);
      toast.success(su.updateSuccess);
    } catch (err) {
      console.error("updateUser failed:", err);
      toast.error(userApiErrorMessage(err, su.updateError));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeactivate() {
    if (!deactivateTarget) return;
    const target = deactivateTarget;
    setBusyId(target.id);
    try {
      await removeUser(target.id);
      toast.success(su.deactivateSuccess);
    } catch (err) {
      console.error("deactivateUser failed:", err);
      toast.error(userApiErrorMessage(err, su.deactivateError));
    } finally {
      setBusyId(null);
      setDeactivateTarget(null);
    }
  }

  function formatDate(value: string) {
    try {
      return format(new Date(value), "d MMM yyyy", { locale: idLocale });
    } catch {
      return "-";
    }
  }

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={su.searchPlaceholder}
            className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-9 pr-3 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
          />
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:from-indigo-700 hover:to-violet-700 hover:shadow-lg"
        >
          <UserPlus size={16} /> {su.addButton}
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-14">
            <Loader2 size={22} className="animate-spin text-indigo-500" />
          </div>
        ) : forbidden ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/40">
              <ShieldAlert size={22} className="text-red-400" />
            </div>
            <p className="font-medium text-slate-600 dark:text-slate-300">{su.forbiddenTitle}</p>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">{su.forbiddenDesc}</p>
          </div>
        ) : error ? (
          <div className="py-14 text-center text-sm text-red-500">{error}</div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800">
              <UsersIcon size={22} className="text-slate-300 dark:text-slate-600" />
            </div>
            <p className="font-medium text-slate-600 dark:text-slate-300">{su.emptyTitle}</p>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">{su.emptyDesc}</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map((user) => {
              const isSelf = !!currentEmail && user.email === currentEmail;
              const isBusy = busyId === user.id;
              return (
                <li key={user.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 text-sm font-bold text-white select-none">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="truncate font-medium text-slate-800 dark:text-slate-200">{user.username}</span>
                        {isSelf && (
                          <span className="rounded-md bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-300">
                            {su.youBadge}
                          </span>
                        )}
                      </div>
                      <p className="truncate text-xs text-slate-400 dark:text-slate-500">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <span className="rounded-lg bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300">
                      {user.role}
                    </span>
                    <span
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium ${
                        user.is_active
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {user.is_active ? su.statusActive : su.statusInactive}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">{formatDate(user.created_at)}</span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditTarget(user)}
                        aria-label={su.editAria}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setPasswordTarget(user)}
                        aria-label={su.resetPasswordAria}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                      >
                        <KeyRound size={15} />
                      </button>
                      <button
                        onClick={() => setDeactivateTarget(user)}
                        disabled={isSelf || isBusy || !user.is_active}
                        aria-label={su.deactivateAria}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <UserX size={15} />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {!loading && !forbidden && !error && total > limit && (
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-5 py-3">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {offset + 1}–{Math.min(offset + limit, total)} / {total}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={prevPage}
                disabled={offset === 0}
                className="rounded-lg p-1.5 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 transition disabled:opacity-40"
              >
                <ChevronLeft size={15} />
              </button>
              <span className="px-2 text-xs text-slate-600 dark:text-slate-400">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={offset + limit >= total}
                className="rounded-lg p-1.5 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 transition disabled:opacity-40"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      <UserFormDialog mode="create" open={createOpen} onOpenChange={setCreateOpen} loading={submitting} onSubmit={handleCreate} />

      <UserFormDialog
        mode="edit"
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
        initial={editTarget}
        loading={submitting}
        onSubmit={handleEdit}
      />

      <ResetPasswordDialog target={passwordTarget} onClose={() => setPasswordTarget(null)} resetPassword={resetPassword} />

      <Dialog open={!!deactivateTarget} onOpenChange={(open) => !open && setDeactivateTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{su.deactivateConfirmTitle}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {su.deactivateConfirmDesc.replace("{name}", deactivateTarget?.username ?? "")}
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDeactivateTarget(null)}
              disabled={busyId === deactivateTarget?.id}
              className="h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 text-sm font-medium text-slate-600 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
            >
              {su.deactivateConfirmNo}
            </button>
            <button
              type="button"
              onClick={handleDeactivate}
              disabled={busyId === deactivateTarget?.id}
              className="flex h-9 items-center gap-1.5 rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              {busyId === deactivateTarget?.id && <Loader2 size={14} className="animate-spin" />}
              {su.deactivateConfirmYes}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ResetPasswordDialog({
  target,
  onClose,
  resetPassword,
}: {
  target: UserRecord | null;
  onClose: () => void;
  resetPassword: (id: string, newPassword: string) => Promise<any>;
}) {
  const { t } = useTranslation();
  const su = t.settings.users;
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (target) {
      setPassword("");
      setShowPassword(false);
      setError("");
    }
  }, [target]);

  async function handleSubmit() {
    if (!target) return;
    if (password.length < 8) {
      setError(su.errorPasswordLength);
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await resetPassword(target.id, password);
      toast.success(su.passwordSuccess);
      onClose();
    } catch (err) {
      console.error("resetPassword failed:", err);
      toast.error(userApiErrorMessage(err, su.passwordError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={!!target} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{su.passwordDialogTitle}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-slate-500 dark:text-slate-400">{su.passwordDialogDesc}</p>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {su.newPasswordLabel}
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

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 text-sm font-medium text-slate-600 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {su.cancel}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 text-sm font-medium text-white transition hover:from-indigo-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting && <Loader2 size={14} className="animate-spin" />}
            {submitting ? su.saving : su.saveButton}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
