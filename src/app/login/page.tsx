import { Container } from "@/components/layout/Container";
import { AuthForm } from "@/features/auth";

export default function LoginPage() {
  return (
    <Container className="section-spacing">
      <AuthForm variant="login" />
    </Container>
  );
}
