import { Container } from "@/components/layout/Container";
import { SessionPanel } from "@/features/auth";

export default function SessionPage() {
  return (
    <Container className="section-spacing">
      <SessionPanel />
    </Container>
  );
}

