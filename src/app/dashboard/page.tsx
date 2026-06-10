
"use client";

import { useMemo } from 'react';
import { useUser, useDoc, useCollection, useFirestore } from '@/firebase';
import { doc, query, collection, orderBy, limit, where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Leaf, 
  Zap, 
  TrendingDown, 
  Trophy, 
  ArrowRight, 
  CheckCircle2, 
  Calculator, 
  BookOpen,
  Activity as ActivityIcon,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { CHALLENGES } from '@/lib/challenges';
import { getLevelFromPoints } from '@/lib/levels';

export default function Dashboard() {
  const { user } = useUser();
  const db = useFirestore();

  // Firestore Data Streams
  const profileRef = useMemo(() => (user && db ? doc(db, 'users', user.uid) : null), [user, db]);
  const { data: profile } = useDoc(profileRef);

  const activitiesQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, 'activities'), where('userId', '==', user.uid), orderBy('timestamp', 'desc'), limit(5));
  }, [db, user]);
  const { data: activities } = useCollection(activitiesQuery);

  const recordsQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, 'calculator_records'), where('userId', '==', user.uid), orderBy('timestamp', 'desc'));
  }, [db, user]);
  const { data: records } = useCollection(recordsQuery);

  const progressQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, 'challenge_progress'), where('userId', '==', user.uid));
  }, [db, user]);
  const { data: challengeProgress } = useCollection(progressQuery);

  // Derived State
  const points = profile?.greenPoints || 0;
  const score = profile?.sustainabilityScore || 0;
  const level = getLevelFromPoints(points);
  const challengesCompletedCount = profile?.completedChallenges?.length || 0;
  const totalEmissions = records?.[0]?.totalEmissions || 0;
  const totalSaved = records?.reduce((acc, curr) => acc + (curr.totalEmissions < 500 ? 500 - curr.totalEmissions : 0), 0) || 0;

  // Active Challenge Logic
  const activeChallenge = useMemo(() => {
    const completedIds = profile?.completedChallenges || [];
    return CHALLENGES.find(c => !completedIds.includes(c.id)) || CHALLENGES[0];
  }, [profile]);

  const currentProgress = useMemo(() => {
    if (!challengeProgress || !activeChallenge) return null;
    return challengeProgress.find(p => p.challengeId === activeChallenge.id);
  }, [challengeProgress, activeChallenge]);

  const hasData = records && records.length > 0;

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <p className="text-muted-foreground/60 text-[10px] font-bold uppercase tracking-[0.3em]">Welcome Back, Explorer</p>
          <h1 className="text-4xl font-headline font-bold text-white tracking-tight">
            {user?.displayName || 'Eco Warrior'}
          </h1>
          <p className="text-primary/60 text-xs font-bold tracking-widest uppercase">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-4">
           <Link href="/calculator">
            <Button size="sm" className="bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 rounded-xl px-5 py-5 font-bold tracking-widest text-[10px] uppercase">
              <Calculator className="h-4 w-4 mr-2" /> New Audit
            </Button>
           </Link>
        </div>
      </section>

      {/* Sustainability Hero */}
      <section className="glass-card rounded-[2.5rem] p-12 relative overflow-hidden border-primary/20 shadow-[0_30px_60px_rgba(0,0,0,0.6)] group">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-primary/10 via-primary/0 to-transparent pointer-events-none" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <div className="space-y-8 lg:col-span-2">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-2xl ring-4 ring-primary/5">
                <Leaf className="h-8 w-8 text-primary drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              </div>
              <div>
                <h2 className="text-3xl font-headline font-bold text-white">Sustainability Pulse</h2>
                <p className="text-muted-foreground/60 text-sm">Aggregated performance across all environmental protocols.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <HeroMetric label="Score" value={score.toFixed(0)} subValue="pts" color="text-primary" />
              <HeroMetric label="Green Points" value={points.toString()} subValue="total" color="text-accent" />
              <HeroMetric label="Current Level" value={level} color="text-white" isSmall />
              <HeroMetric label="Reduction" value="0" subValue="%" color="text-emerald-400" />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center space-y-4 p-8 bg-white/5 rounded-[2rem] border border-white/5 backdrop-blur-xl">
             <div className="relative flex items-center justify-center">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle className="text-white/5" strokeWidth="10" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80" />
                  <circle className="text-primary shadow-[0_0_20px_rgba(16,185,129,0.5)]" strokeWidth="10" strokeDasharray="440" strokeDashoffset={440 * (1 - score / 100)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-headline font-bold text-white emerald-glow">{score.toFixed(0)}</span>
                  <span className="text-[9px] font-bold text-muted-foreground/40 tracking-[0.2em] uppercase">Rating</span>
                </div>
             </div>
             <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">Verified Score Index</p>
          </div>
        </div>
      </section>

      {!hasData ? (
        <EmptyState />
      ) : (
        <>
          {/* Active Challenge & KPIs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 glass-card border-none rounded-[2rem] overflow-hidden p-8 flex flex-col justify-between">
              <CardHeader className="p-0 mb-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <Badge variant="outline" className="text-primary border-primary/30 text-[9px] font-bold tracking-widest uppercase mb-2">Active Challenge</Badge>
                    <CardTitle className="text-2xl font-headline font-bold">{activeChallenge.title}</CardTitle>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Reward</p>
                    <p className="text-xl font-headline font-bold text-primary">+{activeChallenge.reward} Pts</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <p className="text-muted-foreground text-sm leading-relaxed">{activeChallenge.description}</p>
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <span>Progress: 0%</span>
                    <span>7 Days Remaining</span>
                  </div>
                  <Progress value={0} className="h-2 bg-white/5" />
                </div>
              </CardContent>
              <div className="mt-8 pt-6 border-t border-white/5">
                 <Button variant="ghost" className="w-full justify-between text-primary font-bold group hover:bg-primary/10 rounded-xl py-6">
                    Update Progress <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                 </Button>
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-6">
              <KPICard label="Emissions" value={totalEmissions.toFixed(1)} unit="kgCO2e" icon={TrendingDown} color="text-red-400" />
              <KPICard label="Carbon Saved" value={totalSaved.toFixed(1)} unit="kg" icon={Leaf} color="text-emerald-400" />
              <KPICard label="Completed" value={challengesCompletedCount.toString()} unit="tasks" icon={CheckCircle2} color="text-primary" />
            </div>
          </div>

          {/* Social & Rewards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="space-y-6">
               <div className="flex items-center gap-4 px-4">
                  <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
                  <h2 className="text-[11px] font-bold tracking-[0.3em] uppercase text-white/60">Milestone Rewards</h2>
                  <div className="flex-1 h-px bg-white/5" />
               </div>
               <div className="glass-card rounded-[2rem] p-8 grid grid-cols-2 gap-4">
                  <AchievementCard title="First Audit" locked={!hasData} icon={Calculator} />
                  <AchievementCard title="First Challenge" locked={challengesCompletedCount === 0} icon={Trophy} />
                  <AchievementCard title="100 Points" locked={points < 100} icon={Sparkles} />
                  <AchievementCard title="Eco Veteran" locked={points < 500} icon={Trophy} />
               </div>
            </section>

            <section className="space-y-6">
               <div className="flex items-center gap-4 px-4">
                  <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_hsl(var(--accent))]" />
                  <h2 className="text-[11px] font-bold tracking-[0.3em] uppercase text-white/60">System Log</h2>
                  <div className="flex-1 h-px bg-white/5" />
               </div>
               <div className="glass-card rounded-[2rem] p-8 space-y-6">
                  {activities && activities.length > 0 ? (
                    activities.map((act, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                         <div className="flex items-center gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                               <ActivityIcon className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                               <p className="text-[11px] font-bold text-white">{act.description}</p>
                               <p className="text-[9px] text-muted-foreground uppercase">{new Date(act.timestamp).toLocaleDateString()}</p>
                            </div>
                         </div>
                         <Badge variant="outline" className="text-[10px] text-primary border-primary/20">+{act.pointsEarned} Pts</Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                       <p className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest">No activities recorded yet.</p>
                    </div>
                  )}
               </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

function HeroMetric({ label, value, subValue, color, isSmall }: any) {
  return (
    <div className="space-y-1">
      <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className={cn("font-headline font-bold tracking-tighter", isSmall ? "text-xl" : "text-3xl md:text-4xl", color)}>
          {value}
        </span>
        {subValue && <span className="text-[10px] font-bold text-muted-foreground/40 uppercase">{subValue}</span>}
      </div>
    </div>
  );
}

function KPICard({ label, value, unit, icon: Icon, color }: any) {
  return (
    <div className="glass-card rounded-2xl p-6 flex items-center justify-between group transition-all hover:bg-white/5 border-none">
       <div className="space-y-1">
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
          <div className="flex items-baseline gap-2">
             <span className="text-2xl font-headline font-bold text-white">{value}</span>
             <span className="text-[10px] font-bold text-muted-foreground/40 uppercase">{unit}</span>
          </div>
       </div>
       <div className={cn("p-3 rounded-xl bg-white/5 transition-transform group-hover:scale-110", color)}>
          <Icon className="h-6 w-6" />
       </div>
    </div>
  );
}

function AchievementCard({ title, locked, icon: Icon }: any) {
  return (
    <div className={cn(
      "p-4 rounded-2xl flex flex-col items-center justify-center space-y-3 transition-all",
      locked ? "bg-white/5 opacity-40 grayscale" : "bg-primary/10 border border-primary/20"
    )}>
       <Icon className={cn("h-6 w-6", locked ? "text-muted-foreground" : "text-primary")} />
       <p className="text-[9px] font-bold uppercase tracking-widest text-center">{title}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="glass-card border-none rounded-[2.5rem] p-12 text-center space-y-8 animate-in zoom-in duration-500">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto ring-8 ring-primary/5">
        <Sparkles className="h-10 w-10 text-primary animate-pulse" />
      </div>
      <div className="space-y-4">
        <h2 className="text-4xl font-headline font-bold text-white tracking-tight">Welcome to EcoPulse AI</h2>
        <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
          Your environmental footprint is a blank canvas. Complete your first carbon calculation to start tracking your impact and unlock personalized strategies.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
        <Link href="/calculator">
          <Button size="lg" className="h-14 px-10 bg-primary text-primary-foreground font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
            Start First Audit
          </Button>
        </Link>
        <Link href="/knowledge-hub">
          <Button size="lg" variant="outline" className="h-14 px-10 border-white/10 text-white font-bold rounded-2xl hover:bg-white/5">
            Explore Library
          </Button>
        </Link>
      </div>
    </Card>
  );
}
