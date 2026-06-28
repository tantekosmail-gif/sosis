"use client";

import { Bell, Search } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 px-6 py-5 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            AI Social Intelligence Platform
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-72 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Notification */}
          <button className="relative h-11 w-11 rounded-xl border border-gray-200 hover:bg-gray-50">
            <Bell className="mx-auto" size={20} />

            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* Profile */}
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              Y
            </div>

            <div>
              <p className="font-semibold text-sm">
                Yusuf
              </p>

              <p className="text-xs text-gray-500">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}