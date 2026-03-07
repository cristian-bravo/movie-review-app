import { Container } from "@/components/layout/Container";
import { AuthForm } from "@/features/auth";

export default function RegisterPage() {
  return (
    <Container className="section-spacing">
      <AuthForm variant="register" />
    </Container>
  );
}

