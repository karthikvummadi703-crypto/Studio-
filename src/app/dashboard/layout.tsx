
"use client";

import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { FloatingAIAdvisor } from '@/components/ai/floating-advisor';
import { Bell, Globe } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useUser } from '@/firebase';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();

  return (
    <div className="relative min-h-screen bg-[#060a0a] text-foreground font-body overflow-hidden">
      {/* Global Background Image */}
      <div 
        className="fixed inset-0 z-0 opacity-20 pointer-events-none bg-cover bg-center grayscale-[20%] sepia-[10%]" 
        style={{ backgroundImage: "url('https://picsum.photos/seed/ecopulse-bg/1920/1080')" }}
        data-ai-hint="lush green valley landscape"
      />
      
      <div className="relative z-10 flex h-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0 h-screen">
          <header className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">
            <div className="flex flex-col">
              <p className="text-[10px] font-bold text-primary/60 tracking-[0.2em] uppercase">Status: Live</p>
              <h2 className="text-xs font-headline font-bold text-white uppercase tracking-widest">Environmental Control Center</h2>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20">
                <Globe className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground/80 uppercase">Planetary Boundary Sync</span>
              </div>
              
              <button className="relative p-2 text-muted-foreground/40 hover:text-white transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-3 h-3 bg-primary rounded-full border-2 border-[#060a0a]"></span>
              </button>
              
              <div className="flex items-center gap-3 pl-4 border-l border-white/5">
                <div className="text-right hidden sm:block">
                  <p className="text-[11px] font-bold text-white tracking-tight">{user?.displayName || 'User'}</p>
                  <p className="text-[9px] font-bold text-primary tracking-widest uppercase">Verified Node</p>
                </div>
                <Avatar className="h-10 w-10 border border-primary/20 rounded-xl bg-primary/10">
                  <AvatarFallback className="text-primary font-bold">
                    {user?.displayName?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto space-y-10 pb-24">
              {children}
            </div>
          </main>

          <FloatingAIAdvisor />
        </div>
      </div>
    </div>
  );
}
