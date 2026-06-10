'use client';

import React, { useCallback, useMemo, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { DashboardSidebar } from './dashboard-sidebar';
import { MoreHorizontal, Bell, Search, X } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useUser } from '@/firebase';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';

const FloatingAIAdvisor = dynamic(
  () => import('@/components/ai/floating-advisor').then(m => ({ default: m.FloatingAIAdvisor })),
  { ssr: false }
);

export function GlobalNavigation({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  // Handle mounting state to prevent hydration mismatches
  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthPage = useMemo(() => {
    return pathname === '/login' || pathname === '/register' || pathname === '/';
  }, [pathname]);

  // Auth Guard Redirection Logic
  useEffect(() => {
    if (mounted && !isLoading) {
      if (!user && !isAuthPage) {
        router.replace('/login');
      } else if (user && isAuthPage) {
        router.replace('/dashboard');
      }
    }
  }, [isLoading, user, isAuthPage, router, mounted]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const userInitial = useMemo(() => {
    return user?.displayName?.[0] || user?.email?.[0] || 'E';
  }, [user]);

  // Only show navigation UI if user is authenticated and not on an auth page
  const showNav = mounted && !isAuthPage && user;

  return (
    <div className="flex h-screen overflow-hidden w-full bg-transparent">
      {showNav && (
        <nav 
          className={cn(
            "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}
        >
          <DashboardSidebar onClose={closeSidebar} />
        </nav>
      )}

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {showNav && (
          <header className="h-16 border-b border-black/5 bg-white/95 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm transition-all">
            <div className="flex items-center gap-6">
              <button 
                onClick={toggleSidebar}
                className="p-2 hover:bg-primary/10 rounded-full text-primary transition-all flex items-center justify-center"
              >
                {isSidebarOpen ? <X className="h-6 w-6" /> : <MoreHorizontal className="h-8 w-8" />}
              </button>

              <div className="flex flex-col select-none">
                <p className="text-[9px] font-black text-primary tracking-[0.2em] uppercase">EcoPulse AI</p>
                <h2 className="text-[11px] font-headline font-bold text-foreground uppercase tracking-widest hidden sm:block">Node Active</h2>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex relative w-48 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Search..." 
                  className="pl-9 h-8 bg-white/40 border-primary/10 rounded-full text-[10px]"
                />
              </div>
              <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                <Bell className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-primary/10">
                <Avatar className="h-8 w-8 border border-primary/30 rounded-lg bg-primary/10 shadow-sm">
                  <AvatarFallback className="text-primary text-[10px] font-bold">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>
        )}
        
        <main className="flex-1 overflow-y-auto custom-scrollbar relative bg-transparent">
          <div className={cn(
            "max-w-7xl mx-auto p-4 sm:p-8 pb-24 relative z-10",
            showNav && "bg-white/10 min-h-full"
          )}>
            {children}
          </div>
          {showNav && <FloatingAIAdvisor />}
        </main>
      </div>

      {showNav && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/10 z-40 md:hidden" 
          onClick={closeSidebar}
        />
      )}
    </div>
  );
}
