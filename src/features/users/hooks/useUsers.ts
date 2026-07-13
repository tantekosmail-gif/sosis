"use client";

import { useCallback, useEffect, useState } from "react";
import {
  listUsers,
  createUser,
  updateUser,
  updateUserPassword,
  deactivateUser,
  type UserRecord,
  type CreateUserPayload,
  type UpdateUserPayload,
} from "../services/user.service";
import { userApiErrorMessage } from "../lib/apiError";

export const USERS_PAGE_SIZE = 10;

export function useUsers() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [forbidden, setForbidden] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    setForbidden(false);
    try {
      const raw = await listUsers({ q: query || undefined, limit: USERS_PAGE_SIZE, offset });
      const body = raw?.data ?? raw;
      setUsers(Array.isArray(body?.items) ? body.items : []);
      setTotal(body?.total ?? 0);
    } catch (err: any) {
      if (err?.response?.status === 403) {
        setForbidden(true);
      } else {
        console.error("listUsers failed:", err);
        setError(userApiErrorMessage(err, "Gagal memuat daftar user"));
      }
    } finally {
      setLoading(false);
    }
  }, [query, offset]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function search(q: string) {
    setQuery(q);
    setOffset(0);
  }

  function nextPage() {
    setOffset((o) => (o + USERS_PAGE_SIZE < total ? o + USERS_PAGE_SIZE : o));
  }

  function prevPage() {
    setOffset((o) => Math.max(0, o - USERS_PAGE_SIZE));
  }

  const addUser = useCallback(
    async (payload: CreateUserPayload) => {
      await createUser(payload);
      await refresh();
    },
    [refresh]
  );

  const editUser = useCallback(
    async (id: string, payload: UpdateUserPayload) => {
      await updateUser(id, payload);
      await refresh();
    },
    [refresh]
  );

  const resetPassword = useCallback(async (id: string, newPassword: string) => {
    return await updateUserPassword(id, newPassword);
  }, []);

  const removeUser = useCallback(
    async (id: string) => {
      await deactivateUser(id);
      await refresh();
    },
    [refresh]
  );

  return {
    users,
    total,
    offset,
    limit: USERS_PAGE_SIZE,
    query,
    loading,
    error,
    forbidden,
    refresh,
    search,
    nextPage,
    prevPage,
    addUser,
    editUser,
    resetPassword,
    removeUser,
  };
}
