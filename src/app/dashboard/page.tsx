
"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Leaf, 
  Trophy, 
  History, 
  Sparkles,
  ChevronRight,
  Target
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useUser, useDoc, useCollection, useFirestore } from '@/firebase';
import { collection, query, limit, orderBy, doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { CHALLENGES } from '@/lib/challenges';
import { LEVEL_CONFIG, getLevelFromPoints } from '@/lib/levels';

export default function Dashboard() {
  const { user } = useUser();
  const db = useFirestore();

  const profileRef = useMemo(() => (user && db ? doc(db, 'users', user.uid) : null), [user, db]);
  const { data: profile } = useDoc(profileRef);
  
  const activitiesQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, 'activities'), orderBy('timestamp', 'desc'), limit(5));
  }, [db, user]);
  const { data: activities } = useCollection(activitiesQuery);

  const recordsQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, 'calculator_records'), orderBy('timestamp', 'desc'), limit(1));
  }, [db, user]);
  const { data: latestRecords } = useCollection(recordsQuery);
  const latestRecord = latestRecords?.[0];

  const points = profile?.greenPoints || 0;
  const level = getLevelFromPoints(points);
  const currentLevelConfig = LEVEL_CONFIG[level];
  const levelProgress = currentLevelConfig.max === Infinity 
    ? 100 
    : ((points - currentLevelConfig.min) / (currentLevelConfig.max - currentLevelConfig.min)) * 100;

  const activeChallenge = CHALLENGES.find(c => !profile?.completedChallenges?.includes(c.id)) || CHALLENGES[CHALLENGES.length - 1];

  const categoryData = latestRecord ? [
    { name: 'Transport', value: latestRecord.breakdown.transportation, color: '#39F3BB' },
    { name: 'Energy', value: latestRecord.breakdown.homeEnergy, color: '#31C352' },
    { name: 'Food', value: latestRecord.breakdown.food, color: '#1a4035' },
    { name: 'Lifestyle', value: latestRecord.breakdown.lifestyle, color: '#52d9a9' },
  ] : [];

  const handleCompleteChallenge = () => {
    if (!profileRef || !activeChallenge) return;
    
    updateDoc(profileRef, {
      completedChallenges: arrayUnion(activeChallenge.id),
      greenPoints: increment(activeChallenge.reward)
    });
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Welcome, {profile?.fullName?.split(' ')[0] || 'Eco-Explorer'}</h1>
          <p className="text-muted-foreground">Your sustainability journey is making a difference.</p>
        </div>
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-3 p-3 glass-card rounded-2xl">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Level</p>
              <p className="text-xl font-headline font-bold text-primary">{level}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 glass-card rounded-2xl">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Points</p>
              <p className="text-xl font-headline font-bold text-accent">{points}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass-card border-none overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline">Carbon Footprint Summary</CardTitle>
              <CardDescription>Based on your latest calculation</CardDescription>
            </div>
            {latestRecord && (
               <Badge variant="outline" className="border-primary/50 text-primary px-3 py-1">
                 {latestRecord.totalEmissions.toFixed(1)} kgCO2e
               </Badge>
            )}
          </CardHeader>
          <CardContent className="h-[300px] flex items-center">
            {latestRecord ? (
               <>
                <ResponsiveContainer width="50%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                      {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1a1f1e', border: 'none', borderRadius: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="w-1/2 space-y-4">
                  {categoryData.map(c => (
                    <div key={c.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                        <span className="text-sm font-medium">{c.name}</span>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">{((c.value / latestRecord.totalEmissions) * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
               </>
            ) : (
              <div className="w-full text-center space-y-4">
                <Leaf className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
                <p className="text-muted-foreground italic">No data yet. Complete a calculation to see your breakdown.</p>
                <Button asChild variant="outline">
                  <Link href="/calculator">Start Calculating</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card border-none bg-primary/5 border border-primary/10">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Active Challenge
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-xl bg-background/50 border border-white/5 space-y-3">
              <h3 className="font-bold text-lg">{activeChallenge.title}</h3>
              <p className="text-sm text-muted-foreground">{activeChallenge.description}</p>
              <div className="flex items-center justify-between pt-2">
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30">+{activeChallenge.reward} Points</Badge>
                <Button size="sm" onClick={handleCompleteChallenge} variant="outline" className="h-8 text-xs">Complete</Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <span>Level Progress</span>
                <span>{Math.round(levelProgress)}%</span>
              </div>
              <Progress value={levelProgress} className="h-2 bg-white/5" />
              <p className="text-[10px] text-muted-foreground">Keep earning points to level up!</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 glass-card border-none">
          <CardHeader>
            <CardTitle className="font-headline">Sustainability Evolution</CardTitle>
            <CardDescription>Your impact score history</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[{ name: 'Current', value: profile?.sustainabilityScore || 0 }]}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} />
                   <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#888' }} />
                   <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#1a1f1e', border: 'none', borderRadius: '12px' }} />
                   <Bar dataKey="value" fill="#39F3BB" radius={[10, 10, 0, 0]} barSize={60} />
                </BarChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card border-none">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Activity Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {activities && activities.length > 0 ? (
               activities.map((act: any) => (
                 <div key={act.id} className="flex items-start gap-3 text-sm p-2 rounded-lg hover:bg-white/5 transition-colors">
                   <div className="mt-1 w-2 h-2 rounded-full bg-primary" />
                   <div>
                     <p className="font-medium">{act.description}</p>
                     <p className="text-muted-foreground text-[10px] uppercase font-bold">{new Date(act.timestamp).toLocaleDateString()}</p>
                   </div>
                 </div>
               ))
             ) : (
               <div className="text-center py-10 opacity-30 italic text-sm">
                 Your activity will appear here.
               </div>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
