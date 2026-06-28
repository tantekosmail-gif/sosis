"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Mail, Lock, LogIn } from "lucide-react";

import { loginSchema, LoginSchema } from "../types/login.schema";
import { login } from "../services/auth.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
  const router = useRouter();

  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginSchema) {
    // for temporary
    const ACCESS_TOKEN =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZjE5ODc3Yi1iMDU0LTQ5MzUtOTE5Yi1kZDQ1ZjQwYTY0MjYiLCJleHAiOjE3ODUyMzQyODAsInR5cGUiOiJhY2Nlc3MiLCJyb2xlIjoidXNlciJ9.i92pl1B9lpLQ7F0nwyFPA6ZWQEYXFEmwJya003ctdvo";
    localStorage.setItem("access_token", ACCESS_TOKEN);
    localStorage.setItem("refresh_token", ACCESS_TOKEN);
    localStorage.setItem(
      "user",
      JSON.stringify({
        username: "buqen@gmail.com",
        email: "Admin1234",
        role: "Administrator",
      }),
    );
    router.replace("/dashboard");
    // for temporary

    setError("");

    try {
      await login(data.email, data.password);
      router.replace("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl"
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Welcome Back 👋</h2>

        <p className="mt-1 text-sm text-slate-500">
          Sign in to continue to your dashboard.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Email
        </label>

        <div className="relative">
          <Mail
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <Input
            {...register("email")}
            placeholder="name@company.com"
            className="h-12 border-slate-300 bg-white pl-10 focus:border-blue-500"
          />
        </div>

        {errors.email && (
          <p className="mt-2 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Password
        </label>

        <div className="relative">
          <Lock
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <Input
            type="password"
            {...register("password")}
            placeholder="••••••••"
            className="h-12 border-slate-300 bg-white pl-10 focus:border-blue-500"
          />
        </div>

        {errors.password && (
          <p className="mt-2 text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-12 w-full rounded-xl bg-blue-600 text-white hover:bg-blue-700"
      >
        <LogIn size={18} className="mr-2" />
        {isSubmitting ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
}
