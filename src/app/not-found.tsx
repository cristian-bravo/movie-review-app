import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { Surface } from "@/components/ui/Surface";

export default function NotFound() {
  return (
    <Container className="section-spacing">
      <Surface className="mx-auto max-w-2xl space-y-6 text-center">
        <Badge>404</Badge>
        <div className="space-y-3">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground">
            Movie not found
          </h1>
          <p className="text-base leading-7 text-muted-foreground">
            The requested title is not available in the current catalog or API response.
          </p>
        </div>
        <Link
          href="/movies"
          className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          Go to movie catalog
        </Link>
      </Surface>
    </Container>
  );
}
