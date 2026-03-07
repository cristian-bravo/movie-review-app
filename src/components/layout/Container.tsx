import type { PropsWithChildren } from "react";

import { cn } from "@/utils/cn";

const containerVariants = {
  content: "mx-auto w-full max-w-screen-2xl px-6 md:px-10 lg:px-16",
  wide: "mx-auto w-full max-w-screen-2xl px-6 md:px-10 lg:px-16",
  full: "mx-auto w-full max-w-screen-2xl px-6 md:px-10 lg:px-16",
} as const;

interface ContainerProps extends PropsWithChildren {
  className?: string;
  variant?: keyof typeof containerVariants;
}

export function Container({
  className,
  children,
  variant = "content",
}: ContainerProps) {
  return (
    <div className={cn(containerVariants[variant], className)}>
      {children}
    </div>
  );
}
