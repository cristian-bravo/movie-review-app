import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: EmptyStateProps) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-dashed border-white/14 bg-surface px-6 py-12 text-center shadow-soft">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(147,51,234,0.14),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.12),transparent_28%)]" />
      <div className="relative z-10 mx-auto max-w-2xl space-y-4">
        <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h3>
        <p className="text-sm leading-7 text-muted-foreground">{description}</p>
        {actionHref && actionLabel ? (
          <Link
            href={actionHref}
            className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
          >
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
