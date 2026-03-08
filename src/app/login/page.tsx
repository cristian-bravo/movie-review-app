import { Container } from "@/components/layout/Container";
import { AuthForm } from "@/features/auth";

export default function LoginPage() {
  return (
    <Container
      variant="wide"
      className="flex min-h-[calc(100vh-5rem)] !max-w-6xl items-center !px-6 py-20"
    >
      <AuthForm variant="login" />
    </Container>
  );
}
