import { api } from "@/lib/api";

export async function login(email: string, password: string) {
  const { data } = await api.post("/api/v1/auth/login", {
    email,
    password,
  });

  const auth = data.data;

  // Untuk sementara akses token hardcode

  const ACCESS_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZjE5ODc3Yi1iMDU0LTQ5MzUtOTE5Yi1kZDQ1ZjQwYTY0MjYiLCJleHAiOjE3ODUyMzQyODAsInR5cGUiOiJhY2Nlc3MiLCJyb2xlIjoidXNlciJ9.i92pl1B9lpLQ7F0nwyFPA6ZWQEYXFEmwJya003ctdvo";

  localStorage.setItem("access_token", ACCESS_TOKEN);
  localStorage.setItem("refresh_token", ACCESS_TOKEN);
  // localStorage.setItem("access_token", auth.access_token);
  // localStorage.setItem("refresh_token", auth.refresh_token);

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
