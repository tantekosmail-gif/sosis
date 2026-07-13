// PATCH /users/{id}/password membalas error validasi (mis. password < 8 karakter)
// dalam format bawaan FastAPI ({ detail: [...] }), berbeda dari endpoint lain yang
// selalu pakai wrapper { success, error: { code, message } }. Helper ini menangani
// kedua bentuk supaya pesan errornya tetap manusiawi di UI.
export function userApiErrorMessage(err: any, fallback: string): string {
  const data = err?.response?.data;
  if (data?.error?.message) return data.error.message;
  if (Array.isArray(data?.detail) && data.detail.length > 0) {
    return data.detail.map((d: any) => d?.msg).filter(Boolean).join(", ") || fallback;
  }
  if (typeof data?.detail === "string") return data.detail;
  return data?.message || err?.message || fallback;
}
