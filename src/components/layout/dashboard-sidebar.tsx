"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calculator, 
  BookOpen, 
  User, 
  Leaf,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const menuItems = [
  { name: 'DASHBOARD', href: '/dashboard', icon: LayoutDashboard },
  { name: 'CALCULATOR', href: '/calculator', icon: Calculator },
  { name: 'KNOWLEDGE HUB', href: '/knowledge-hub', icon: BookOpen },
  { name: 'PROFILE', href: '/profile', icon: User },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/5 flex flex-col h-screen sticky top-0 bg-[#060a0a] z-40">
      <div className="p-6 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Leaf className="h-5 w-5 text-primary-foreground fill-current" />
          </div>
          <span className="font-headline font-bold text-lg tracking-[0.2em] text-white">ECOPULSE AI</span>
        </Link>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/50 hover:text-white">
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-6">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-4 py-4 rounded-lg transition-all text-xs font-bold tracking-widest",
                isActive 
                  ? "nav-active text-primary" 
                  : "text-muted-foreground/60 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground/40")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto">
        <div className="p-4 rounded-xl bg-[#0c1413] border border-white/5 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-muted-foreground tracking-tighter">GRID CAP</span>
            <span className="text-[10px] font-bold text-primary tracking-tighter">SECURE</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-primary shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-6 text-[10px] font-bold text-destructive/80 hover:text-destructive transition-colors mt-2">
          <span className="tracking-[0.2em]">SIGN OUT</span>
        </button>
      </div>
    </aside>
  );
}
