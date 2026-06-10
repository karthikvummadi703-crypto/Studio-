"use client";

import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Leaf, 
  ArrowUp, 
  History, 
  Zap, 
} from 'lucide-react';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';

export default function Dashboard() {
  const { user } = useUser();
  const db = useFirestore();

  const profileRef = useMemo(() => (user && db ? doc(db, 'users', user.uid) : null), [user, db]);
  const { data: profile } = useDoc(profileRef);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Environmental Overview Banner */}
      <section className="glass-card rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-headline font-bold text-white tracking-tight">Environmental Overview</h1>
              <Badge variant="outline" className="bg-primary/10 border-primary/40 text-primary text-[10px] font-bold tracking-widest uppercase px-2 py-0.5">
                First Account Sync
              </Badge>
            </div>
            <p className="text-muted-foreground/60 text-sm max-w-md">Pristine companion metrics synced with active global ecological standards.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase mr-3">Environment State:</span>
                <Badge className="bg-primary/20 text-primary border-none text-[10px] font-bold">EMPTY DB</Badge>
             </div>
             <div className="text-right">
                <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase mr-3">Populated (Active)</span>
             </div>
          </div>
        </div>
      </section>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Carbon Score Card */}
        <Card className="glass-card border-none rounded-2xl overflow-hidden relative group">
          <div className="absolute top-4 right-4 flex flex-col items-end opacity-40">
             <span className="text-[9px] font-bold tracking-widest uppercase">Score Index</span>
             <Badge variant="outline" className="text-[8px] text-accent border-accent/20 px-1 py-0 h-4 uppercase">Not Calculated Yet</Badge>
          </div>
          <CardContent className="p-8 flex flex-col items-center justify-center space-y-6">
            <div className="relative flex items-center justify-center">
               <svg className="w-40 h-40 transform -rotate-90">
                 <circle className="text-white/5" strokeWidth="8" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80" />
                 <circle className="text-primary/10" strokeWidth="8" strokeDasharray="440" strokeDashoffset="440" strokeLinecap="round" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80" />
               </svg>
               <div className="absolute flex flex-col items-center">
                 <Leaf className="h-8 w-8 text-primary/40" />
                 <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase mt-2">Empty</span>
               </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-[10px] font-bold text-white tracking-[0.15em] uppercase">Carbon Score</p>
              <p className="text-[10px] text-muted-foreground/40 leading-relaxed px-4">Log today's transport, diet, or waste to establish your first baseline rating.</p>
            </div>
          </CardContent>
        </Card>

        {/* CO2 Emissions Card */}
        <Card className="glass-card border-none rounded-2xl overflow-hidden relative">
          <div className="absolute top-4 right-4 flex flex-col items-end opacity-40">
             <span className="text-[9px] font-bold tracking-widest uppercase">Analysis</span>
             <Badge variant="outline" className="text-[8px] border-white/10 px-1 py-0 h-4 uppercase">No Data Available</Badge>
          </div>
          <CardContent className="p-8 flex flex-col h-full justify-between space-y-12">
            <div className="flex items-center justify-center h-32 relative">
               <div className="flex gap-2 items-end h-16 opacity-10">
                  <div className="w-1.5 h-full bg-primary/20 rounded-full" />
                  <div className="w-1.5 h-1/2 bg-primary/20 rounded-full" />
                  <div className="w-1.5 h-3/4 bg-primary/20 rounded-full" />
                  <div className="w-1.5 h-1/4 bg-primary/20 rounded-full" />
               </div>
               <div className="absolute w-full h-px bg-white/5 border-dashed" />
            </div>
            <div className="text-center space-y-4">
              <p className="text-[10px] font-bold text-white tracking-[0.15em] uppercase">CO₂ Emissions</p>
              <p className="text-xs text-muted-foreground/40 italic">No telemetry recorded for the current tracking cycle.</p>
            </div>
          </CardContent>
        </Card>

        {/* CO2 Saved Card */}
        <Card className="glass-card border-none rounded-2xl overflow-hidden relative">
          <div className="absolute top-4 right-4 flex flex-col items-end opacity-40">
             <span className="text-[9px] font-bold tracking-widest uppercase">Track Overall</span>
             <span className="text-[10px] font-bold text-primary">0 kg</span>
          </div>
          <CardContent className="p-8 flex flex-col items-center justify-center space-y-10">
            <div className="w-24 h-24 rounded-full border border-white/5 flex flex-col items-center justify-center bg-gradient-to-b from-white/5 to-transparent">
               <ArrowUp className="h-10 w-10 text-primary opacity-40" />
               <span className="text-[8px] font-bold text-muted-foreground/40 uppercase mt-1 tracking-widest">0.0 kg logged</span>
            </div>
            <div className="text-center space-y-3">
              <p className="text-[10px] font-bold text-white tracking-[0.15em] uppercase">CO₂ Saved</p>
              <p className="text-[10px] text-muted-foreground/40 leading-relaxed">Carbon savings are measured when substituting activities like switches to electric of high renewables.</p>
            </div>
          </CardContent>
        </Card>

        {/* Green Points Card */}
        <Card className="glass-card border-none rounded-2xl overflow-hidden relative bg-primary/5">
          <div className="absolute top-4 right-4 flex flex-col items-end opacity-40">
             <span className="text-[9px] font-bold tracking-widest uppercase">Awards</span>
             <span className="text-[10px] font-bold text-primary">0</span>
          </div>
          <CardContent className="p-8 flex flex-col items-center justify-center space-y-8">
            <div className="w-24 h-24 transform rotate-45 border border-primary/20 flex items-center justify-center bg-[#0c1413]">
               <div className="transform -rotate-45 flex flex-col items-center">
                  <span className="text-3xl font-headline font-bold text-primary emerald-glow">0</span>
               </div>
            </div>
            <div className="text-center space-y-3">
              <p className="text-[10px] font-bold text-white tracking-[0.15em] uppercase">Green Points</p>
              <p className="text-[10px] text-muted-foreground/40 leading-relaxed px-2">Points are earned by completing positive sustainability milestones.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
        <section className="space-y-4">
          <div className="flex items-center gap-4 px-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-white">Eco Community Hub</h2>
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[9px] font-bold text-muted-foreground/20 tracking-widest">NETWORK</span>
          </div>
          <div className="glass-card h-64 rounded-3xl flex items-center justify-center">
             <p className="text-[10px] font-bold tracking-widest text-muted-foreground/20 uppercase">Social Connectivity: Offline</p>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-4 px-2">
            <div className="w-2 h-2 rounded-full bg-[#3b82f6]" />
            <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-white">Health & Wearables</h2>
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[9px] font-bold text-muted-foreground/20 tracking-widest">INTEGRATIONS</span>
          </div>
          <div className="glass-card h-64 rounded-3xl flex items-center justify-center">
             <p className="text-[10px] font-bold tracking-widest text-muted-foreground/20 uppercase">No Devices Paired</p>
          </div>
        </section>
      </div>
    </div>
  );
}
