"use client";

import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative w-96">

      <Search
        className="absolute left-3 top-3 text-gray-400"
        size={18}
      />

      <input
        placeholder="Search..."
        className="
        w-full
        rounded-xl
        border
        bg-background
        pl-10
        h-11
        focus:outline-none
        focus:ring-2
        focus:ring-primary
        "
      />

    </div>
  );
}