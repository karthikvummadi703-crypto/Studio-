
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calculator, 
  BookOpen, 
  User, 
  Leaf
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
      <div className="p-8 flex items-center">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="p-2 bg-primary rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-transform group-hover:scale-110">
            <Leaf className="h-5 w-5 text-primary-foreground fill-current" />
          </div>
          <span className="font-headline font-bold text-lg tracking-[0.25em] text-white">ECOPULSE AI</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-8">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-4 px-5 py-4 rounded-xl transition-all text-[11px] font-bold tracking-[0.15em]",
                isActive 
                  ? "nav-active text-primary bg-primary/5 shadow-inner" 
                  : "text-muted-foreground/40 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground/20")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-8 mt-auto">
        <div className="p-5 rounded-2xl bg-[#0c1413] border border-white/5 space-y-4 shadow-2xl">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase">Grid Cap</span>
            <span className="text-[9px] font-bold text-primary tracking-widest uppercase">Secured</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-primary shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
          </div>
        </div>
      </div>
    </aside>
  );
}
