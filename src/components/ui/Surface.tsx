import type { PropsWithChildren } from "react";

import { cn } from "@/utils/cn";

interface SurfaceProps extends PropsWithChildren {
  className?: string;
}

export function Surface({ className, children }: SurfaceProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface/90 p-6 shadow-card backdrop-blur-2xl before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_right,rgba(147,51,234,0.12),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.1),transparent_26%)] before:opacity-60",
        className,
      )}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
