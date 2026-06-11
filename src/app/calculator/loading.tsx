import { Skeleton } from '@/components/ui/skeleton';

/**
 * High-performance skeleton loader for the Carbon Impact Audit node.
 * Ensures zero layout shift during transport mode telemetry initialization.
 */
export default function CalculatorLoading() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-12 animate-pulse">
      <div className="text-center space-y-3">
        <Skeleton className="h-10 w-64 mx-auto rounded-xl" />
        <Skeleton className="h-4 w-80 mx-auto rounded-lg" />
      </div>

      <div className="bg-white border-zinc-100 shadow-sm rounded-[2.5rem] p-10 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-3 w-40" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        </div>

        <Skeleton className="h-16 w-full rounded-2xl" />
      </div>
    </div>
  );
}
