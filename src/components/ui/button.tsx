import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-transparent text-sm font-semibold whitespace-nowrap transition-all duration-150 outline-none select-none cursor-pointer" +
  " focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:ring-offset-1" +
  " disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50" +
  " active:scale-[0.98]" +
  " [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow shadow-indigo-500/25 hover:from-indigo-700 hover:to-violet-700 hover:shadow-md hover:shadow-indigo-500/30",
        secondary:
          "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
        outline:
          "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800",
        ghost:
          "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700",
        destructive:
          "bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:border-red-300 dark:bg-red-950/40",
        link:
          "text-indigo-600 underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-10 px-4",
        sm:      "h-8 px-3 text-xs rounded-lg",
        lg:      "h-12 px-6 text-base",
        icon:    "h-10 w-10",
        "icon-sm": "h-8 w-8 rounded-lg",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
