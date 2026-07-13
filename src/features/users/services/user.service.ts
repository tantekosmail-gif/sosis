import { api } from "@/lib/api";

export interface UserRecord {
  id: string;
  email: string;
  username: string;
  role: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
}

export interface ListUsersParams {
  q?: string;
  limit?: number;
  offset?: number;
}

export interface CreateUserPayload {
  email: string;
  username: string;
  password: string;
  role?: string;
  is_active?: boolean;
}

export interface UpdateUserPayload {
  username?: string;
  email?: string;
  role?: string;
  is_active?: boolean;
  is_superuser?: boolean;
}

// GET /api/v1/users?q=&limit=&offset= — daftar/cari user (admin only).
export async function listUsers(params?: ListUsersParams) {
  const { data } = await api.get("/api/v1/users", { params });
  return data;
}

// GET /api/v1/users/{id} — detail satu user.
export async function getUser(id: string) {
  const { data } = await api.get(`/api/v1/users/${id}`);
  return data;
}

// POST /api/v1/users — buat user baru.
export async function createUser(payload: CreateUserPayload) {
  const { data } = await api.post("/api/v1/users", payload);
  return data;
}

// PATCH /api/v1/users/{id} — kirim hanya field yang berubah.
export async function updateUser(id: string, payload: UpdateUserPayload) {
  const { data } = await api.patch(`/api/v1/users/${id}`, payload);
  return data;
}

// PATCH /api/v1/users/{id}/password — admin set password baru, tanpa perlu password lama.
export async function updateUserPassword(id: string, newPassword: string) {
  const { data } = await api.patch(`/api/v1/users/${id}/password`, { new_password: newPassword });
  return data;
}

// DELETE /api/v1/users/{id} — soft delete (is_active=false), bukan hapus permanen.
export async function deactivateUser(id: string) {
  const { data } = await api.delete(`/api/v1/users/${id}`);
  return data;
}
