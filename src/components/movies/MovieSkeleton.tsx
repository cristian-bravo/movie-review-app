import styles from "@/styles/components/movie-skeleton.module.css";

export function MovieSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className="animate-pulse">
        <div className={styles.poster} />

        <div className={styles.content}>
          <div className="h-4 w-20 rounded-full bg-white/10" />
          <div className="h-7 w-4/5 rounded-full bg-white/12" />
          <div className="h-11 w-full rounded-xl bg-white/10" />
        </div>
      </div>
    </div>
  );
}
