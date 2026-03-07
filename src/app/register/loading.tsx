import { Container } from "@/components/layout/Container";
import { LoadingCard } from "@/components/ui/LoadingCard";

export default function RegisterLoading() {
  return (
    <Container className="section-spacing">
      <LoadingCard className="mx-auto max-w-xl min-h-[28rem]" />
    </Container>
  );
}
