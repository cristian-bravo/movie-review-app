import { Container } from "@/components/layout/Container";
import { LoadingCard } from "@/components/ui/LoadingCard";

export default function MoviesLoading() {
  return (
    <Container className="section-spacing stack-gap">
      <LoadingCard className="min-h-[28rem]" />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </div>
    </Container>
  );
}

