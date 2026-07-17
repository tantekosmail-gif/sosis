import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const compactNumberFormatter = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

// 1000000 -> "1M", 1052423 -> "1.1M", 15000 -> "15K" — dipakai buat angka besar
// (views/likes) yang lebih enak dibaca ringkas daripada digit penuh.
export function formatCompactNumber(n: number) {
  return compactNumberFormatter.format(n);
}
