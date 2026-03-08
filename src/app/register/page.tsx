import { Suspense } from "react";

import { Container } from "@/components/layout/Container";
import { LoadingCard } from "@/components/ui/LoadingCard";
import { AuthForm } from "@/features/auth";

function RegisterFormFallback() {
  return (
    <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(21rem,0.98fr)] xl:gap-8">
      <LoadingCard className="order-2 min-h-[24rem] lg:order-1 lg:min-h-[42rem]" />
      <LoadingCard className="order-1 min-h-[34rem] lg:order-2" />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Container
      variant="wide"
      className="flex min-h-[calc(100vh-5rem)] max-w-none items-stretch px-4 pb-8 pt-14 sm:px-6 sm:pt-16 lg:px-8 lg:pb-8 lg:pt-6"
    >
      <Suspense fallback={<RegisterFormFallback />}>
        <AuthForm variant="register" />
      </Suspense>
    </Container>
  );
}
