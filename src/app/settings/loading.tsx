import { Skeleton } from '@/components/ui/skeleton';

/**
 * High-performance skeleton loader for the Settings node.
 */
export default function SettingsLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-48 w-full rounded-2xl" />
      <Skeleton className="h-32 w-full rounded-2xl" />
      <Skeleton className="h-24 w-full rounded-2xl" />
    </div>
  );
}
