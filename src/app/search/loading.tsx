import { Container } from "@/components/layout/Container";
import { LoadingCard } from "@/components/ui/LoadingCard";

export default function SearchLoading() {
  return (
    <Container className="section-spacing stack-gap">
      <div className="space-y-4">
        <div className="h-4 w-24 animate-pulse rounded-full bg-foreground/8" />
        <div className="h-12 max-w-xl animate-pulse rounded-full bg-foreground/10" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </div>
    </Container>
  );
}

