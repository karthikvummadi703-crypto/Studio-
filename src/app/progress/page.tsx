"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { Trophy, Milestone, Award, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const historyData = [
  { date: '2024-01', emissions: 500, goal: 450 },
  { date: '2024-02', emissions: 480, goal: 450 },
  { date: '2024-03', emissions: 420, goal: 400 },
  { date: '2024-04', emissions: 430, goal: 400 },
  { date: '2024-05', emissions: 380, goal: 350 },
  { date: '2024-06', emissions: 350, goal: 350 },
];

export default function ProgressPage() {
  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-4xl font-headline font-bold">Progress Analytics</h1>
        <p className="text-muted-foreground">Track your evolution and celebrate your sustainability milestones.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 glass-card border-none">
          <CardHeader>
            <CardTitle className="font-headline">Carbon Reduction Journey</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="colorEm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#39F3BB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#39F3BB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#888' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1f1e', border: 'none', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="emissions" stroke="#39F3BB" fillOpacity={1} fill="url(#colorEm)" />
                <Line type="monotone" dataKey="goal" stroke="#ffffff30" strokeDasharray="5 5" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="font-headline">Current Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <GoalItem label="Reduce beef intake" progress={75} />
              <GoalItem label="Walk more than 5km/day" progress={30} />
              <GoalItem label="Zero plastic waste week" progress={100} completed />
            </CardContent>
          </Card>

          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle className="font-headline">Latest Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <Achievement icon={Award} title="Forest Protector" date="June 12" color="text-primary" />
               <Achievement icon={Milestone} title="1 Tonne Saved" date="May 28" color="text-accent" />
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
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className={completed ? "line-through text-muted-foreground" : "font-medium"}>{label}</span>
        <Badge variant={completed ? "default" : "outline"} className={completed ? "bg-primary text-primary-foreground" : ""}>
          {completed ? "Done" : `${progress}%`}
        </Badge>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-1000", completed ? "bg-primary" : "bg-primary/50")}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function Achievement({ icon: Icon, title, date, color }: any) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
      <div className={cn("p-2 rounded-lg bg-white/5", color)}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="text-xs text-muted-foreground">Unlocked on {date}</p>
      </div>
    </div>
  );
}
