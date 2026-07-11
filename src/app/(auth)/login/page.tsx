"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import AuthLayout from "@/components/layout/AuthLayout";
import Footer from "@/features/auth/components/Footer";
import LoginForm from "@/features/auth/components/LoginForm";
import Logo from "@/features/auth/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      router.replace("/overview");
      return;
    }
    setCheckingAuth(false);
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <AuthLayout>
      <Logo />
      <LoginForm />
      <Footer />
    </AuthLayout>
  );
}
