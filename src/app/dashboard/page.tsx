"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Leaf, 
  TrendingDown, 
  ArrowUpRight, 
  Zap, 
  Trophy, 
  History, 
  PlusCircle, 
  Sparkles,
  Car,
  Home,
  Utensils,
  ShoppingBag
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, collection, query, limit, getDocs, orderBy } from 'firebase/firestore';

const emissionData = [
  { name: 'Jan', value: 450 },
  { name: 'Feb', value: 420 },
  { name: 'Mar', value: 380 },
  { name: 'Apr', value: 410 },
  { name: 'May', value: 350 },
  { name: 'Jun', value: 320 },
];

const categoryData = [
  { name: 'Transport', value: 400, color: '#39F3BB' },
  { name: 'Energy', value: 300, color: '#31C352' },
  { name: 'Food', value: 200, color: '#1a4035' },
  { name: 'Lifestyle', value: 100, color: '#52d9a9' },
];

export default function Dashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) setUserData(userDoc.data());

        const actQuery = query(
          collection(db, 'activities'), 
          orderBy('timestamp', 'desc'), 
          limit(5)
        );
        const actSnap = await getDocs(actQuery);
        setActivities(actSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Welcome back, {userData?.fullName?.split(' ')[0] || 'Explorer'}</h1>
          <p className="text-muted-foreground">Your sustainability journey is making a difference.</p>
        </div>
        <div className="flex items-center gap-3 p-3 glass-card rounded-2xl">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Sustainability Score</p>
            <p className="text-xl font-headline font-bold text-primary">{userData?.sustainabilityScore || 75}</p>
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Monthly Emissions" 
          value="320 kgCO2e" 
          change="-12%" 
          trend="down"
          icon={TrendingDown}
          description="Total generated this month"
        />
        <KPICard 
          title="Carbon Saved" 
          value="1,240 kg" 
          change="+18%" 
          trend="up"
          icon={Leaf}
          description="Lifetime reduction progress"
        />
        <KPICard 
          title="Green Actions" 
          value="24" 
          change="+4" 
          trend="up"
          icon={PlusCircle}
          description="Sustainability tasks completed"
        />
        <KPICard 
          title="Reduction Rate" 
          value="22.5%" 
          change="+2.1%" 
          trend="up"
          icon={ArrowUpRight}
          description="Vs. regional average"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Emission Trend Chart */}
        <Card className="lg:col-span-2 glass-card border-none">
          <CardHeader>
            <CardTitle className="font-headline">Emissions Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emissionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#888', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#888', fontSize: 12 }} 
                />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#1a1f1e', border: 'none', borderRadius: '12px' }}
                />
                <Bar dataKey="value" fill="#39F3BB" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* AI Insights Card */}
        <Card className="glass-card border-none overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4">
             <Sparkles className="h-6 w-6 text-primary/40 animate-pulse" />
          </div>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <p className="text-sm italic">
                "Based on your recent commuting data, switching to carpooling for just 2 days a week would reduce your monthly transport emissions by 15%."
              </p>
            </div>
            <div className="space-y-4">
              <InsightItem label="Energy Saver" text="Switching to LED bulbs in the living room." />
              <InsightItem label="Food Impact" text="Replacing beef with chicken for 3 meals/week." />
            </div>
            <Button asChild className="w-full bg-primary text-primary-foreground group-hover:shadow-[0_0_20px_rgba(57,243,187,0.3)] transition-all">
              <Link href="/insights">Get Full Analysis</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Categories Pie Chart */}
        <Card className="glass-card border-none">
          <CardHeader>
            <CardTitle className="font-headline">Emission Categories</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1f1e', border: 'none', borderRadius: '12px' }}
                  />
                </PieChart>
             </ResponsiveContainer>
             <div className="grid grid-cols-2 gap-2 text-xs ml-4">
               {categoryData.map(c => (
                 <div key={c.name} className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                   <span>{c.name}</span>
                 </div>
               ))}
             </div>
          </CardContent>
        </Card>

        {/* Achievements Section */}
        <Card className="glass-card border-none">
          <CardHeader>
            <CardTitle className="font-headline">Milestones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AchievementItem 
              icon={Car} 
              title="Commuter Pro" 
              progress={80} 
              description="Save 100kg via public transport" 
            />
            <AchievementItem 
              icon={Zap} 
              title="Energy Ninja" 
              progress={45} 
              description="Reduce home energy by 10%" 
            />
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="glass-card border-none">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {activities.length > 0 ? (
               activities.map(act => (
                 <div key={act.id} className="flex items-start gap-3 text-sm">
                   <div className="mt-1 w-2 h-2 rounded-full bg-primary" />
                   <div>
                     <p className="font-medium">{act.description}</p>
                     <p className="text-muted-foreground text-xs">{new Date(act.timestamp).toLocaleDateString()}</p>
                   </div>
                 </div>
               ))
             ) : (
               <div className="text-center py-6 text-muted-foreground italic">
                  No recent activities. Calculate your footprint to begin.
               </div>
             )}
             <Button variant="link" asChild className="p-0 h-auto text-primary text-xs">
               <Link href="/progress">View All Activity</Link>
             </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Button asChild size="lg" className="bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20">
          <Link href="/calculator"><PlusCircle className="mr-2 h-5 w-5" /> Calculate Footprint</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="border-white/10 hover:bg-white/5">
          <Link href="/recommendations">Browse Tips</Link>
        </Button>
      </div>
    </div>
  );
}

function KPICard({ title, value, change, trend, icon: Icon, description }: any) {
  return (
    <Card className="glass-card border-none overflow-hidden hover:scale-[1.02] transition-transform">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <Badge variant={trend === 'up' ? 'default' : 'secondary'} className={cn(
            "font-mono",
            trend === 'up' ? "bg-accent/20 text-accent border-accent/20" : "bg-primary/20 text-primary border-primary/20"
          )}>
            {change}
          </Badge>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{title}</p>
          <p className="text-2xl font-headline font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function InsightItem({ label, text }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-1 bg-primary/10 rounded mt-1">
        <PlusCircle className="h-3 w-3 text-primary" />
      </div>
      <div>
        <p className="text-xs font-bold uppercase text-primary">{label}</p>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}

function AchievementItem({ icon: Icon, title, progress, description }: any) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{title}</span>
        </div>
        <span className="text-xs text-muted-foreground">{progress}%</span>
      </div>
      <Progress value={progress} className="h-1 bg-white/5" />
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
