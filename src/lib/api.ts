import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 60000,

  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  return config;
});

export async function apiGet<T>(url: string): Promise<T> {
  const { data } = await api.get<T>(url);

  return data;
}

export async function apiPost<T>(url: string, body?: unknown): Promise<T> {
  const { data } = await api.post<T>(url, body);

  return data;
}

export async function apiPut<T>(url: string, body?: unknown): Promise<T> {
  const { data } = await api.put<T>(url, body);

  return data;
}

export async function apiDelete<T>(url: string): Promise<T> {
  const { data } = await api.delete<T>(url);

  return data;
}
