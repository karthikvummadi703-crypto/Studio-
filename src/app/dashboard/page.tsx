
"use client";

import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Leaf, 
  ArrowUp, 
  Zap, 
  TrendingDown,
  Sparkles,
  Trophy
} from 'lucide-react';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function Dashboard() {
  const { user } = useUser();
  const db = useFirestore();

  const profileRef = useMemo(() => (user && db ? doc(db, 'users', user.uid) : null), [user, db]);
  const { data: profile } = useDoc(profileRef);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Environmental Overview Banner */}
      <section className="glass-card rounded-[2.5rem] p-10 relative overflow-hidden border-primary/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 via-primary/0 to-transparent" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Environmental Overview</h1>
              <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1">
                Active Cycle: Q2 2026
              </Badge>
            </div>
            <p className="text-muted-foreground/60 text-base max-w-xl font-body leading-relaxed">
              Your real-time sustainability metrics, synthesized with global ecological standards and AI-driven telemetry.
            </p>
          </div>
          <div className="flex items-center gap-8 bg-white/5 px-6 py-4 rounded-3xl border border-white/5 backdrop-blur-md">
             <div className="text-right">
                <span className="text-[10px] font-bold text-muted-foreground/40 tracking-[0.2em] uppercase block mb-1">Engine State</span>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-none text-[10px] font-bold px-2 py-0">LIVE SYNC</Badge>
             </div>
             <div className="h-10 w-px bg-white/10" />
             <div className="text-right">
                <span className="text-[10px] font-bold text-muted-foreground/40 tracking-[0.2em] uppercase block mb-1">Node Status</span>
                <span className="text-xs font-bold text-white tracking-tight">Verified Proxy</span>
             </div>
          </div>
        </div>
      </section>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Carbon Score Card */}
        <Card className="glass-card border-none rounded-[2rem] overflow-hidden relative group transition-all hover:translate-y-[-4px]">
          <div className="absolute top-6 right-6 flex flex-col items-end opacity-60">
             <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-1">Score Index</span>
             <Badge variant="outline" className="text-[9px] text-primary border-primary/20 px-2 py-0 h-5 uppercase bg-primary/5">Optimal Range</Badge>
          </div>
          <CardContent className="p-10 flex flex-col items-center justify-center space-y-8">
            <div className="relative flex items-center justify-center">
               <svg className="w-48 h-48 transform -rotate-90">
                 <circle className="text-white/5" strokeWidth="10" stroke="currentColor" fill="transparent" r="85" cx="96" cy="96" />
                 <circle className="text-primary shadow-[0_0_20px_rgba(16,185,129,0.5)]" strokeWidth="10" strokeDasharray="534" strokeDashoffset={534 * (1 - (profile?.sustainabilityScore || 75) / 100)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="85" cx="96" cy="96" />
               </svg>
               <div className="absolute flex flex-col items-center">
                 <span className="text-5xl font-headline font-bold text-white emerald-glow">{profile?.sustainabilityScore || 75}</span>
                 <span className="text-[10px] font-bold text-muted-foreground/60 tracking-[0.2em] uppercase mt-2">Rating</span>
               </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-[11px] font-bold text-white tracking-[0.25em] uppercase">Carbon Score</p>
              <p className="text-[11px] text-muted-foreground/40 leading-relaxed px-2">Aggregated performance across transportation, energy, and diet protocols.</p>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Card */}
        <Card className="glass-card border-none rounded-[2rem] overflow-hidden relative transition-all hover:translate-y-[-4px]">
          <div className="absolute top-6 right-6 flex flex-col items-end opacity-60">
             <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-1">Analysis</span>
             <Badge variant="outline" className="text-[9px] border-white/10 px-2 py-0 h-5 uppercase bg-white/5">Weekly Cycle</Badge>
          </div>
          <CardContent className="p-10 flex flex-col h-full justify-between space-y-12">
            <div className="flex items-end justify-between h-40 pt-10 px-2">
               {[40, 70, 45, 90, 60, 80].map((h, i) => (
                 <div key={i} className="w-2 bg-primary/20 rounded-full relative group cursor-help h-full flex items-end">
                    <div className="w-full bg-primary rounded-full transition-all group-hover:bg-white" style={{ height: `${h}%` }} />
                 </div>
               ))}
            </div>
            <div className="text-center space-y-4 pt-4 border-t border-white/5">
              <p className="text-[11px] font-bold text-white tracking-[0.25em] uppercase">CO₂ Emissions</p>
              <div className="flex items-center justify-center gap-2">
                 <TrendingDown className="h-4 w-4 text-emerald-400" />
                 <span className="text-lg font-headline font-bold text-white">-12.4%</span>
                 <span className="text-[10px] text-muted-foreground uppercase tracking-widest">v. Prev</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CO2 Saved Card */}
        <Card className="glass-card border-none rounded-[2rem] overflow-hidden relative transition-all hover:translate-y-[-4px]">
          <div className="absolute top-6 right-6 flex flex-col items-end opacity-60">
             <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-1">Net Savings</span>
             <span className="text-xs font-bold text-primary tracking-tight">342.5 kg</span>
          </div>
          <CardContent className="p-10 flex flex-col items-center justify-center space-y-12">
            <div className="w-32 h-32 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-transparent shadow-inner">
               <ArrowUp className="h-12 w-12 text-primary drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
               <span className="text-[9px] font-bold text-white uppercase mt-3 tracking-[0.2em]">Verified</span>
            </div>
            <div className="text-center space-y-3">
              <p className="text-[11px] font-bold text-white tracking-[0.25em] uppercase">CO₂ Offset</p>
              <p className="text-[11px] text-muted-foreground/40 leading-relaxed">Calculated through active avoidance of carbon-intensive supply chains.</p>
            </div>
          </CardContent>
        </Card>

        {/* Green Points Card */}
        <Card className="glass-card border-none rounded-[2rem] overflow-hidden relative bg-primary/5 transition-all hover:translate-y-[-4px]">
          <div className="absolute top-6 right-6 flex flex-col items-end">
             <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/60 mb-1">Rewards</span>
             <Trophy className="h-4 w-4 text-primary" />
          </div>
          <CardContent className="p-10 flex flex-col items-center justify-center space-y-10">
            <div className="w-28 h-28 transform rotate-45 border-2 border-primary/30 flex items-center justify-center bg-[#0c1413] shadow-[0_0_30px_rgba(16,185,129,0.2)] rounded-2xl">
               <div className="transform -rotate-45 flex flex-col items-center">
                  <span className="text-5xl font-headline font-bold text-primary emerald-glow">{profile?.greenPoints || 850}</span>
                  <span className="text-[9px] font-bold text-primary/40 tracking-[0.2em] uppercase mt-2">Points</span>
               </div>
            </div>
            <div className="text-center space-y-3">
              <p className="text-[11px] font-bold text-white tracking-[0.25em] uppercase">Green Equity</p>
              <p className="text-[11px] text-muted-foreground/40 leading-relaxed px-2">Convertible points earned through verified sustainability milestones.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Social & Integrations Hub */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
        <section className="space-y-6">
          <div className="flex items-center gap-4 px-4">
            <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
            <h2 className="text-[12px] font-bold tracking-[0.3em] uppercase text-white">Eco Community Network</h2>
            <div className="flex-1 h-px bg-white/5" />
          </div>
          <div className="glass-card h-72 rounded-[2.5rem] flex items-center justify-center border-white/5 overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="text-center space-y-4 relative z-10">
                <Globe className="h-10 w-10 text-muted-foreground/20 mx-auto animate-pulse" />
                <p className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground/40 uppercase">Global Hub: Establishing Connection...</p>
             </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-4 px-4">
            <div className="w-3 h-3 rounded-full bg-accent shadow-[0_0_10px_hsl(var(--accent))]" />
            <h2 className="text-[12px] font-bold tracking-[0.3em] uppercase text-white">Biometric Integrations</h2>
            <div className="flex-1 h-px bg-white/5" />
          </div>
          <div className="glass-card h-72 rounded-[2.5rem] flex items-center justify-center border-white/5 overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="text-center space-y-4 relative z-10">
                <Zap className="h-10 w-10 text-muted-foreground/20 mx-auto" />
                <p className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground/40 uppercase">No Active Wearables Paired</p>
                <Badge variant="outline" className="border-white/10 text-muted-foreground/40 text-[9px] uppercase tracking-widest cursor-pointer hover:bg-white/5 transition-colors">
                  Pair Device
                </Badge>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Globe({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}
