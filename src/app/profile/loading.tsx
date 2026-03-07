import { Container } from "@/components/layout/Container";
import { LoadingCard } from "@/components/ui/LoadingCard";

export default function ProfileLoading() {
  return (
    <Container className="section-spacing stack-gap">
      <LoadingCard className="min-h-[22rem]" />
      <div className="grid gap-6 lg:grid-cols-2">
        <LoadingCard />
        <LoadingCard />
      </div>
    </Container>
  );
}

