"use client";

import { useEffect, useState } from "react";
import { Bell, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface User {
  username?: string;
  email?: string;
  role?: string;
}

export default function DashboardHeader() {
  const router = useRouter();

  const [user, setUser] = useState<User>({});

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user:", error);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    router.replace("/login");
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Social Intelligence Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitoring & Analytics Platform
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <button className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-50">
            <Bell size={20} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
              {(user.username ?? "A").charAt(0).toUpperCase()}
            </div>

            <div>
              <div className="font-semibold text-slate-900">
                {user.username ?? "Administrator"}
              </div>

              <div className="text-xs text-slate-500">
                {user.email ?? "admin@mail.com"}
              </div>

              <div className="text-xs text-blue-600">
                {user.role ?? "Administrator"}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
