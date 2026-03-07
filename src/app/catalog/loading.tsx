import { Container } from "@/components/layout/Container";
import { MovieSkeleton } from "@/components/movies/MovieSkeleton";

const SKELETON_COUNT = 8;

export default function CatalogLoading() {
  return (
    <Container className="section-spacing stack-gap">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-surface/90 px-5 py-10 shadow-card backdrop-blur-2xl md:px-8 md:py-14 xl:px-12">
        <div className="animate-pulse space-y-5 text-center">
          <div className="mx-auto h-4 w-24 rounded-full bg-white/10" />
          <div className="mx-auto h-12 w-full max-w-2xl rounded-full bg-white/12" />
          <div className="mx-auto h-6 w-full max-w-xl rounded-full bg-white/10" />
          <div className="mx-auto h-20 w-full max-w-3xl rounded-[1.5rem] bg-white/8" />
        </div>
      </section>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <MovieSkeleton key={index} />
        ))}
      </div>
    </Container>
  );
}
