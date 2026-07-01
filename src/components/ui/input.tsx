import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Base
        "h-10 w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900",
        // Placeholder
        "placeholder:text-slate-400",
        // Transition
        "transition-colors duration-150",
        // Focus
        "focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
        // Disabled
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-100",
        // Invalid
        "aria-invalid:border-red-400 aria-invalid:ring-2 aria-invalid:ring-red-400/20",
        // File input
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-slate-700",
        className
      )}
      {...props}
    />
  )
}

export { Input }
