
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Line 
} from 'recharts';
import { Trophy, Milestone, Award, CheckCircle2, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const historyData = [
  { date: 'Jan', emissions: 500, goal: 450 },
  { date: 'Feb', emissions: 480, goal: 450 },
  { date: 'Mar', emissions: 420, goal: 400 },
  { date: 'Apr', emissions: 430, goal: 400 },
  { date: 'May', emissions: 380, goal: 350 },
  { date: 'Jun', emissions: 350, goal: 350 },
];

export default function ProgressPage() {
  return (
    <div className="space-y-10 pb-10 animate-in fade-in duration-500">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
          <TrendingDown className="h-3 w-3" /> Growth Telemetry
        </div>
        <h1 className="text-4xl font-headline font-bold text-foreground">Progress Analytics</h1>
        <p className="text-muted-foreground">Track your evolution and celebrate your sustainability milestones.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 glass-card border-none shadow-2xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Carbon Reduction Journey</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="colorEm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#00000005" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 700 }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0,0,0,0.05)', 
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                  }}
                  itemStyle={{ fontWeight: 700, fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="emissions" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorEm)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="goal" 
                  stroke="rgba(0,0,0,0.1)" 
                  strokeDasharray="5 5" 
                  dot={false} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="glass-card border-none shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-lg">Current Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <GoalItem label="Reduce beef intake" progress={75} />
              <GoalItem label="Walk more than 5km/day" progress={30} />
              <GoalItem label="Zero plastic waste week" progress={100} completed />
            </CardContent>
          </Card>

          <Card className="glass-card border-none shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-lg">Latest Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <Achievement icon={Award} title="Forest Protector" date="June 12" color="text-primary" />
               <Achievement icon={Milestone} title="1 Tonne Saved" date="May 28" color="text-emerald-500" />
               <Achievement icon={CheckCircle2} title="Daily Streak: 30" date="April 15" color="text-emerald-400" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function GoalItem({ label, progress, completed }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-xs">
        <span className={cn("font-bold", completed ? "line-through text-muted-foreground" : "text-foreground")}>{label}</span>
        <Badge variant={completed ? "default" : "outline"} className={cn("text-[9px] font-black uppercase tracking-tighter", completed ? "bg-primary text-white border-none" : "border-primary/20 text-primary")}>
          {completed ? "Done" : `${progress}%`}
        </Badge>
      </div>
      <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-1000", completed ? "bg-primary" : "bg-primary/40")}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function Achievement({ icon: Icon, title, date, color }: any) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/40 border border-black/5 hover:bg-white/60 transition-all shadow-sm">
      <div className={cn("p-2.5 rounded-xl bg-primary/10 shadow-inner", color)}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-bold text-foreground">{title}</p>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{date}</p>
      </div>
    </div>
  );
}
