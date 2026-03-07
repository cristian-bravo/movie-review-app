import { Container } from "@/components/layout/Container";
import { LoadingCard } from "@/components/ui/LoadingCard";

export default function Loading() {
  return (
    <Container className="section-spacing stack-gap">
      <div className="space-y-4">
        <div className="h-4 w-28 animate-pulse rounded-full bg-foreground/8" />
        <div className="h-14 w-full max-w-2xl animate-pulse rounded-[2rem] bg-foreground/10" />
        <div className="h-6 w-full max-w-3xl animate-pulse rounded-full bg-foreground/8" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <LoadingCard className="lg:col-span-2" />
        <LoadingCard />
        <LoadingCard />
      </div>
    </Container>
  );
}

