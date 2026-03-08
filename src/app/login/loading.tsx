import { Container } from "@/components/layout/Container";
import { LoadingCard } from "@/components/ui/LoadingCard";

export default function LoginLoading() {
  return (
    <Container variant="wide" className="section-spacing">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(21rem,0.98fr)] xl:gap-8">
        <LoadingCard className="order-2 min-h-[24rem] lg:order-1 lg:min-h-[42rem]" />
        <LoadingCard className="order-1 min-h-[32rem] lg:order-2" />
      </div>
    </Container>
  );
}
