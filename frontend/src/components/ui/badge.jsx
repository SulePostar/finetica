import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full px-3 py-1 !text-white text-[11px] w-[85px] h-[28px]font-medium uppercase tracking-wide whitespace-nowrap transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-spurple/15 !border-spurple/20",
        success:
          "bg-green/15 !border-green/20",
        warning:
          "bg-chart-4/15 !border-chart-4/20",
        destructive:
          "bg-destructive/15 !border-destructive/20",
      },
    },
  }
);


function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props} />
  );
}

export { Badge, badgeVariants }
