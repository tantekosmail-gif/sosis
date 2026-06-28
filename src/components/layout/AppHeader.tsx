"use client";

import { Bell } from "lucide-react";

export default function AppHeader() {
  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-8 flex items-center justify-between">

      <div>
        <h2 className="font-semibold text-lg">
          Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-5">

        <Bell size={20} />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            A
          </div>

          <div>
            <p className="font-medium">
              Administrator
            </p>

            <p className="text-xs text-slate-500">
              admin@mail.com
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}