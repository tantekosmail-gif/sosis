"use client";

import { Bell } from "lucide-react";

export default function Notification() {
  return (
    <button
      className="
      relative
      rounded-xl
      border
      p-3
      hover:bg-accent
      transition
      "
    >
      <Bell size={20} />

      <span
        className="
        absolute
        right-2
        top-2
        h-2
        w-2
        rounded-full
        bg-red-500
        "
      />
    </button>
  );
}