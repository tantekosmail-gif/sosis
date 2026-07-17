"use client";

import { ReactNode } from "react";
import { AppLogo } from "@/components/brand/AppLogo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <div className="w-full max-w-md">
        <AppLogo size="sm" theme="light" className="mb-8 items-center" />

        {children}
      </div>
    </div>
  );
}
