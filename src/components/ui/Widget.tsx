"use client";

import { ReactNode } from "react";
import { Download, Maximize2, RefreshCw } from "lucide-react";

interface WidgetProps {
  title: string;
  children: ReactNode;
  loading?: boolean;
  onRefresh?: () => void;
}

export default function Widget({
  title,
  children,
  loading,
  onRefresh,
}: WidgetProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-5 py-4">
        <h2 className="text-lg font-semibold">{title}</h2>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <RefreshCw size={16} />
          </button>

          <button className="rounded-lg p-2 hover:bg-gray-100">
            <Download size={16} />
          </button>

          <button className="rounded-lg p-2 hover:bg-gray-100">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {loading ? (
          <div className="flex h-64 items-center justify-center text-gray-500">
            Loading...
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}