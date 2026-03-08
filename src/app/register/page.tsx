import { Container } from "@/components/layout/Container";
import { AuthForm } from "@/features/auth";

export default function RegisterPage() {
  return (
    <Container
      variant="wide"
      className="flex min-h-[calc(100vh-5rem)] max-w-none items-stretch px-4 pb-8 pt-14 sm:px-6 sm:pt-16 lg:px-8 lg:pb-8 lg:pt-6"
    >
      <AuthForm variant="register" />
    </Container>
  );
}
