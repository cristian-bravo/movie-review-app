import { cn } from "@/utils/cn";

export type FeatureIcon = "play" | "star" | "chat" | "spark";

interface FeatureCardProps {
  icon: FeatureIcon;
  title: string;
  description: string;
  className?: string;
}

function renderIcon(icon: FeatureIcon) {
  switch (icon) {
    case "play":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M7 5.5v13l10-6.5-10-6.5Z" />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="m12 3.6 2.5 5.1 5.6.8-4 3.9 1 5.5-5.1-2.7-5.1 2.7 1-5.5-4-3.9 5.6-.8L12 3.6Z" />
        </svg>
      );
    case "chat":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M7 17.5 3.5 20V6.5A2.5 2.5 0 0 1 6 4h12a2.5 2.5 0 0 1 2.5 2.5v8A2.5 2.5 0 0 1 18 17H7Z" />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="m12 3 1.7 4.8L18.5 9.5l-4.8 1.7L12 16l-1.7-4.8L5.5 9.5l4.8-1.7L12 3Z" />
        </svg>
      );
  }
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <article
      className={cn(
        "group min-w-0 w-full h-full rounded-xl border border-white/10 bg-white/5 p-4 shadow-soft transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-white/25 hover:bg-white/10 hover:shadow-card",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/25 text-gold transition duration-300 group-hover:border-white/20 group-hover:text-white">
          {renderIcon(icon)}
        </span>
        <div className="min-w-0 space-y-2">
          <h3 className="text-[0.88rem] font-semibold tracking-tight text-white">{title}</h3>
          <p className="text-[0.78rem] leading-4 text-neutral-400">{description}</p>
        </div>
      </div>
    </article>
  );
}
