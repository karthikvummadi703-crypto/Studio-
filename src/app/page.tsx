"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2, Leaf } from 'lucide-react';

/**
 * Root page redirector. Handles immediate authentication routing
 * to eliminate extra blank render cycles.
 */
export default function RootPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) return;
    router.replace(user ? '/dashboard' : '/login');
  }, [user, isLoading, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-3xl shadow-lg border border-zinc-100">
        <div className="p-3 bg-primary/10 rounded-2xl">
          <Leaf className="h-10 w-10 text-primary" />
        </div>
        <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Loading...</p>
        <Loader2 className="h-5 w-5 text-primary animate-spin" />
      </div>
    </div>
  );
}
