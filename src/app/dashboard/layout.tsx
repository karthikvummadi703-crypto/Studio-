"use client";

import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { FloatingAIAdvisor } from '@/components/ai/floating-advisor';
import { Input } from '@/components/ui/input';
import { Search, Bell, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#060a0a] text-foreground font-body">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/5 bg-[#060a0a]/50 backdrop-blur-sm flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
            <Input 
              placeholder="Search carbon offset criteria, green points modifiers, or system guidelines..." 
              className="bg-[#0c1413] border-white/5 pl-11 text-xs text-muted-foreground/80 placeholder:text-muted-foreground/30 focus-visible:ring-primary/20 h-10 rounded-full"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20">
              <Globe className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-[10px] font-bold tracking-widest text-muted-foreground/80 uppercase">Sandbox Engine: First-Time Empty</span>
            </div>
            
            <button className="relative p-2 text-muted-foreground/40 hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-[8px] font-bold text-primary-foreground rounded-full flex items-center justify-center border-2 border-[#060a0a]">2</span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-white/5">
              <div className="text-right">
                <p className="text-[11px] font-bold text-white tracking-tight">demo</p>
                <p className="text-[9px] font-bold text-primary tracking-widest uppercase">Standard Tier</p>
              </div>
              <Avatar className="h-10 w-10 border border-primary/20 rounded-xl bg-primary/10">
                <AvatarFallback className="text-primary font-bold">D</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
          <FloatingAIAdvisor />
        </main>

        <footer className="p-4 px-8 border-t border-white/5 bg-[#060a0a]/50 flex justify-between items-center">
          <p className="text-[9px] font-bold text-muted-foreground/40 tracking-[0.2em] uppercase">© 2026 EcoPulse AI. All core algorithms verified in planetary boundary standards.</p>
          <div className="flex items-center gap-4 text-[9px] font-bold tracking-widest text-primary/60">
             <span className="flex items-center gap-2 uppercase"><div className="w-1 h-3 bg-primary/40 animate-pulse"/> CO₂ Offset Network Secured</span>
             <span className="text-muted-foreground/40 uppercase">Launch Intro Splash</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
