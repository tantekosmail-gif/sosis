"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

interface User {
  username: string;
  email: string;
  role: string;
}

export default function ProfileMenu() {
  const [user, setUser] = useState<User>({
    username: "Administrator",
    email: "admin@mail.com",
    role: "Administrator",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedUser = localStorage.getItem("user");

      console.log(storedUser)
      if (storedUser) {
        const parsed = JSON.parse(storedUser);

        setUser({
          username: parsed.username || "Administrator",
          email: parsed.email || "admin@mail.com",
          role: parsed.role || "Administrator",
        });
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  }, []);

  return (
    <button
      className="
        flex
        items-center
        gap-3
        rounded-xl
        border
        border-slate-200
        bg-white
        px-3
        py-2
        shadow-sm
        transition
        hover:bg-slate-50
      "
    >
      {/* Avatar */}
      <div
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          bg-blue-600
          font-semibold
          text-white
        "
      >
        {user.username.charAt(0).toUpperCase()}
      </div>

      {/* User Info */}
      <div className="min-w-0 text-left">
        <p className="truncate text-sm font-semibold text-slate-900">
          {user.username}
        </p>

        <p className="truncate text-xs text-slate-500">{user.email}</p>
      </div>

      <ChevronDown size={18} className="text-slate-500" />
    </button>
  );
}
