import { api } from "@/lib/api";

export async function login(email: string, password: string) {
  const { data } = await api.post("/api/v1/auth/login", {
    email,
    password,
  });

  const auth = data.data;

  localStorage.setItem("access_token", auth.access_token);
  localStorage.setItem("refresh_token", auth.refresh_token);

  localStorage.setItem(
    "user",
    JSON.stringify({
      username: auth.username ?? "Admin",
      email: auth.email ?? email,
      role: auth.role ?? "Administrator",
    }),
  );

  return auth;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
}
