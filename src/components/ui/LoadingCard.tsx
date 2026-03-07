import { cn } from "@/utils/cn";

interface LoadingCardProps {
  className?: string;
}

export function LoadingCard({ className }: LoadingCardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[2rem] border border-white/10 bg-surface p-6 shadow-soft",
        className,
      )}
    >
      <div className="animate-pulse space-y-4">
        <div className="h-44 rounded-[1.5rem] bg-white/8" />
        <div className="space-y-3">
          <div className="h-4 w-1/3 rounded-full bg-white/8" />
          <div className="h-6 w-2/3 rounded-full bg-white/12" />
          <div className="h-4 w-full rounded-full bg-white/8" />
          <div className="h-4 w-5/6 rounded-full bg-white/8" />
        </div>
      </div>
    </div>
  );
}
