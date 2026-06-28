"use client";

import { ChevronDown } from "lucide-react";

export default function ProfileMenu() {
  return (
    <button
      className="
      flex
      items-center
      gap-3
      rounded-xl
      border
      p-2
      hover:bg-accent
      "
    >
      <div
        className="
        h-10
        w-10
        rounded-full
        bg-blue-600
        flex
        items-center
        justify-center
        text-white
        "
      >
        A
      </div>

      <div className="text-left">

        <p className="font-semibold">
          Administrator
        </p>

        <p className="text-xs text-muted-foreground">
          admin@mail.com
        </p>

      </div>

      <ChevronDown size={18} />
    </button>
  );
}