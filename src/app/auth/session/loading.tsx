import { Container } from "@/components/layout/Container";
import { LoadingCard } from "@/components/ui/LoadingCard";

export default function SessionLoading() {
  return (
    <Container className="section-spacing">
      <LoadingCard className="min-h-[22rem]" />
    </Container>
  );
}

