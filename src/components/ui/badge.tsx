import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-lg border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap transition-colors [&>svg]:size-3 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-indigo-200 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40",
        secondary:
          "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400",
        destructive:
          "border-red-200 bg-red-50 text-red-700 dark:bg-red-950/40",
        outline:
          "border-slate-200 bg-transparent text-slate-700 dark:border-slate-700 dark:text-slate-300",
        success:
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40",
        warning:
          "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/40",
        ghost:
          "border-transparent bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
