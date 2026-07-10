import type { ReactNode } from "react";
import { AlertTriangle, Info } from "lucide-react";

interface Props {
  children: ReactNode;
  variant?: "info" | "warning";
}

export default function DocNote({ children, variant = "info" }: Props) {
  const isWarning = variant === "warning";
  const Icon = isWarning ? AlertTriangle : Info;

  return (
    <div
      className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-xs leading-relaxed ${
        isWarning ? "border-amber-200 bg-amber-50 text-amber-800" : "border-indigo-200 bg-indigo-50 text-indigo-800"
      }`}
    >
      <Icon size={14} className="mt-0.5 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
