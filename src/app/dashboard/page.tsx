
"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Leaf, 
  Trophy, 
  History, 
  Sparkles, 
  Target, 
  Zap, 
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import Link from 'next/link';
import { useUser, useDoc, useCollection, useFirestore } from '@/firebase';
import { collection, query, limit, orderBy, doc, updateDoc, arrayUnion, increment, addDoc } from 'firebase/firestore';
import { getNextChallenge } from '@/lib/challenges';
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
  
  const levelProgress = useMemo(() => {
    if (currentLevelConfig.max === Infinity) return 100;
    return ((points - currentLevelConfig.min) / (currentLevelConfig.max - currentLevelConfig.min)) * 100;
  }, [points, currentLevelConfig]);

  const activeChallenge = useMemo(() => {
    return getNextChallenge(profile?.completedChallenges || []);
  }, [profile?.completedChallenges]);

  const footprintData = useMemo(() => {
    if (!latestRecord) return [];
    return [
      { name: 'Transport', value: latestRecord.breakdown.transportation, color: '#10b981' },
      { name: 'Energy', value: latestRecord.breakdown.homeEnergy, color: '#3b82f6' },
      { name: 'Food', value: latestRecord.breakdown.food, color: '#f59e0b' },
      { name: 'Lifestyle', value: latestRecord.breakdown.lifestyle, color: '#8b5cf6' },
    ];
  }, [latestRecord]);

  const handleCompleteChallenge = async () => {
    if (!profileRef || !activeChallenge || !user) return;
    
    updateDoc(profileRef, {
      completedChallenges: arrayUnion(activeChallenge.id),
      greenPoints: increment(activeChallenge.reward)
    });

    addDoc(collection(db, 'activities'), {
      userId: user.uid,
      type: 'challenge',
      description: `Completed Challenge: ${activeChallenge.title}`,
      pointsEarned: activeChallenge.reward,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold">Welcome, {profile?.fullName?.split(' ')[0] || 'Eco-Explorer'}</h1>
          <p className="text-muted-foreground text-lg">Your journey to a net-zero future starts here.</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-card px-6 py-3 rounded-2xl flex items-center gap-3">
            <Trophy className="h-6 w-6 text-primary" />
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Level</p>
              <p className="font-headline font-bold text-xl">{level}</p>
            </div>
          </div>
          <div className="glass-card px-6 py-3 rounded-2xl flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-accent" />
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Green Points</p>
              <p className="font-headline font-bold text-xl text-accent">{points}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Footprint Summary */}
        <Card className="lg:col-span-2 glass-card border-none overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline text-2xl">Carbon Footprint Summary</CardTitle>
              <CardDescription>Based on your latest activity audit</CardDescription>
            </div>
            {latestRecord && (
              <Badge className="bg-primary/20 text-primary border-primary/20 px-4 py-1 text-lg">
                {latestRecord.totalEmissions.toFixed(0)} kg CO2e
              </Badge>
            )}
          </CardHeader>
          <CardContent className="h-[300px]">
            {latestRecord ? (
              <div className="flex h-full items-center">
                <ResponsiveContainer width="50%" height="100%">
                  <PieChart>
                    <Pie data={footprintData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                      {footprintData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0c1110', border: 'none', borderRadius: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="w-1/2 space-y-4 pr-4">
                  {footprintData.map(item => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <span className="text-sm font-mono text-muted-foreground">{item.value.toFixed(0)} kg</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                <Leaf className="h-16 w-16 text-muted-foreground" />
                <p>No calculation history yet. Start your first assessment.</p>
                <Button asChild variant="outline">
                  <Link href="/calculator">Launch Calculator</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Challenge */}
        <Card className="glass-card border-none bg-primary/5 border border-primary/10">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Active Challenge
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {activeChallenge ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-background/40 border border-white/5 space-y-2">
                  <h3 className="font-bold text-lg">{activeChallenge.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{activeChallenge.description}</p>
                  <div className="pt-2">
                    <Badge className="bg-accent/20 text-accent">+{activeChallenge.reward} Points</Badge>
                  </div>
                </div>
                <Button className="w-full bg-primary text-primary-foreground" onClick={handleCompleteChallenge}>
                  Claim Reward
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 space-y-2">
                <Trophy className="h-10 w-10 text-primary mx-auto mb-2" />
                <p className="font-bold">All Challenges Mastered!</p>
                <p className="text-xs text-muted-foreground">Check back soon for new environmental quests.</p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                <span>Next Level Progress</span>
                <span>{Math.round(levelProgress)}%</span>
              </div>
              <Progress value={levelProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Sustainability Score history */}
        <Card className="lg:col-span-2 glass-card border-none">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Evolution of Impact</CardTitle>
            <CardDescription>Visualizing your score over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ name: 'Current', score: profile?.sustainabilityScore || 0 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#0c1110', border: 'none', borderRadius: '12px' }} />
                <Bar dataKey="score" fill="#10b981" radius={[8, 8, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="glass-card border-none">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Activity Log
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities && activities.length > 0 ? (
              activities.map((act: any) => (
                <div key={act.id} className="flex gap-4 items-start p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="mt-1 w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-tight">{act.description}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">
                      {new Date(act.timestamp).toLocaleDateString()} • +{act.pointsEarned} pts
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 opacity-30 italic text-sm">
                No recent activities.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
