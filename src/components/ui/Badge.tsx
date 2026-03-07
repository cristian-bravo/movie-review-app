import type { PropsWithChildren } from "react";

import { cn } from "@/utils/cn";

interface BadgeProps extends PropsWithChildren {
  className?: string;
}

export function Badge({ className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-primary/30 bg-primary/12 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-primary",
        className,
      )}
    >
      {children}
    </span>
  );
}
