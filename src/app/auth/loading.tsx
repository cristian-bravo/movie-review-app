import { Container } from "@/components/layout/Container";
import { LoadingCard } from "@/components/ui/LoadingCard";

export default function AuthLoading() {
  return (
    <Container className="section-spacing">
      <div className="grid gap-6 md:grid-cols-3">
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </div>
    </Container>
  );
}

