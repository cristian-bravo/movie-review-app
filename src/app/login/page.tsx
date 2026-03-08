import { Suspense } from "react";

import { Container } from "@/components/layout/Container";
import { LoadingCard } from "@/components/ui/LoadingCard";
import { AuthForm } from "@/features/auth";

function LoginFormFallback() {
  return (
    <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(21rem,0.98fr)] xl:gap-8">
      <LoadingCard className="order-2 min-h-[24rem] lg:order-1 lg:min-h-[42rem]" />
      <LoadingCard className="order-1 min-h-[32rem] lg:order-2" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Container
      variant="wide"
      className="flex min-h-[calc(100vh-5rem)] !max-w-6xl items-center !px-6 py-20"
    >
      <Suspense fallback={<LoginFormFallback />}>
        <AuthForm variant="login" />
      </Suspense>
    </Container>
  );
}
