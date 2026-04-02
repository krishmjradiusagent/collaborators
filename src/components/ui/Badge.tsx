import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-tight transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        indigo:
           "border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100/80",
        emerald:
           "border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/80",
        amber:
           "border-amber-100 bg-amber-50 text-amber-700 hover:bg-amber-100/80",
        purple:
           "border-purple-100 bg-purple-50 text-purple-700 hover:bg-purple-100/80",
        rose:
           "border-rose-100 bg-rose-50 text-rose-700 hover:bg-rose-100/80",
        slate:
           "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
