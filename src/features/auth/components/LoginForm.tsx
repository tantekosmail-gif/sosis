"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { loginSchema, LoginSchema } from "../types/login.schema";
import { login } from "../services/auth.service";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: LoginSchema) {
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
      className="space-y-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
    >
      {/* Email */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
        <div className="relative">
          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            {...register("email")}
            placeholder="name@company.com"
            className="h-11 pl-10 border-slate-200 bg-slate-50 focus:bg-white"
          />
        </div>
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
        <div className="relative">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            type={showPw ? "text" : "password"}
            {...register("password")}
            placeholder="••••••••"
            className="h-11 pl-10 pr-10 border-slate-200 bg-slate-50 focus:bg-white"
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-sm font-semibold text-white shadow shadow-indigo-500/30 transition hover:from-indigo-700 hover:to-violet-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogIn size={16} />
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
