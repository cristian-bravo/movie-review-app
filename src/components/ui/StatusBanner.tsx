import { cn } from "@/utils/cn";

interface StatusBannerProps {
  tone?: "info" | "error" | "success";
  message: string;
  className?: string;
}

const toneStyles = {
  info: "border-electric/25 bg-electric/10 text-foreground",
  error: "border-pink-glow/30 bg-pink-glow/10 text-foreground",
  success: "border-gold/25 bg-gold/10 text-foreground",
};

export function StatusBanner({
  tone = "info",
  message,
  className,
}: StatusBannerProps) {
  return (
    <div
      className={cn(
        "rounded-[1.4rem] border px-4 py-3 text-sm leading-7 shadow-soft backdrop-blur-xl",
        toneStyles[tone],
        className,
      )}
    >
      {message}
    </div>
  );
}
