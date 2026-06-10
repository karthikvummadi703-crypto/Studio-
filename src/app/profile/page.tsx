
"use client";

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  User, 
  Mail, 
  Calendar, 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  Settings as SettingsIcon,
  Bell,
  Shield,
  LogOut,
  Trash2,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useUser, useDoc, useFirestore, useAuth } from '@/firebase';
import { doc } from 'firebase/firestore';
import { getLevelFromPoints } from '@/lib/levels';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProfilePage() {
  const { user } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const router = useRouter();
  
  const profileRef = useMemo(() => (user && db ? doc(db, 'users', user.uid) : null), [user, db]);
  const { data: profile } = useDoc<any>(profileRef);

  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/login');
  };

  if (!profile) return (
    <div className="flex items-center justify-center h-full min-h-[60vh]">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="h-12 w-12 bg-primary/20 rounded-full" />
        <p className="text-primary font-bold uppercase tracking-widest text-[10px]">Synchronizing Profile...</p>
      </div>
    </div>
  );

  const level = getLevelFromPoints(profile.greenPoints || 0);

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      <header className="space-y-2">
        <h1 className="text-4xl font-headline font-bold text-foreground tracking-tight">User Account</h1>
        <p className="text-muted-foreground text-sm">Manage your environmental profile and platform preferences.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'settings', label: 'Preferences', icon: SettingsIcon },
            { id: 'security', label: 'Security', icon: Shield },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all font-bold text-[11px] uppercase tracking-widest",
                activeTab === tab.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
              )}
            >
              <div className="flex items-center gap-3">
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </div>
              <ChevronRight className={cn("h-4 w-4 transition-transform", activeTab === tab.id ? "rotate-90" : "")} />
            </button>
          ))}
          
          <Separator className="my-6 bg-black/5" />
          
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 px-5 py-6 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-2xl text-[11px] font-bold uppercase tracking-widest"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-8">
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              <Card className="glass-card border-none shadow-xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="bg-primary/5 border-b border-black/5 p-10">
                  <div className="flex items-center gap-8">
                     <div className="h-24 w-24 rounded-[2rem] bg-primary flex items-center justify-center text-white font-headline text-4xl font-bold shadow-2xl ring-8 ring-primary/10">
                       {profile.fullName?.[0] || 'E'}
                     </div>
                     <div className="space-y-2">
                        <CardTitle className="font-headline text-3xl text-foreground">{profile.fullName || 'Eco Warrior'}</CardTitle>
                        <div className="flex gap-4">
                          <p className="text-muted-foreground text-sm flex items-center gap-2">
                            <Mail className="h-4 w-4 text-primary" /> {profile.email}
                          </p>
                          <p className="text-muted-foreground text-sm flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" /> Joined {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : '2024'}
                          </p>
                        </div>
                     </div>
                  </div>
                </CardHeader>
                <CardContent className="p-10 space-y-10">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Sustainability Score</p>
                      <p className="text-4xl font-headline font-bold text-primary emerald-glow">{profile.sustainabilityScore || 0}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Green Points</p>
                      <p className="text-4xl font-headline font-bold text-emerald-600">{profile.greenPoints || 0}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Current Status</p>
                      <Badge className="bg-primary/10 text-primary border-primary/20 font-bold px-4 py-1 uppercase text-[10px] tracking-widest">
                        {level}
                      </Badge>
                    </div>
                  </div>
                  
                  <Separator className="bg-black/5" />
                  
                  <div className="space-y-6">
                     <h3 className="font-headline font-bold text-xl flex items-center gap-3 text-foreground">
                       <Trophy className="h-5 w-5 text-primary" />
                       Milestones Achieved
                     </h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {profile.completedChallenges && profile.completedChallenges.length > 0 ? (
                         profile.completedChallenges.map((id: string) => (
                           <div key={id} className="flex items-center gap-4 p-5 rounded-2xl bg-zinc-50 border border-zinc-100 shadow-sm">
                             <div className="p-2.5 bg-primary/10 rounded-xl">
                               <CheckCircle2 className="h-5 w-5 text-primary" />
                             </div>
                             <span className="text-xs font-bold text-foreground uppercase tracking-tight">
                               {id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                             </span>
                           </div>
                         ))
                       ) : (
                         <div className="col-span-full p-8 rounded-[2rem] bg-zinc-50 border border-dashed border-zinc-200 text-center">
                           <p className="text-sm text-zinc-400 italic">Complete challenges on the dashboard to earn badges.</p>
                         </div>
                       )}
                     </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              <Card className="glass-card border-none shadow-xl rounded-[2.5rem] p-10">
                <CardHeader className="px-0 pt-0 pb-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary rounded-2xl">
                      <Bell className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-headline font-bold">Preferences</CardTitle>
                      <CardDescription>Configure how you interact with EcoPulse.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-0 space-y-10">
                  <div className="flex items-center justify-between p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <div className="space-y-1">
                      <Label className="text-sm font-bold">Impact Summary</Label>
                      <p className="text-xs text-muted-foreground">Receive a performance report every Monday morning.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <div className="space-y-1">
                      <Label className="text-sm font-bold">Challenge Alerts</Label>
                      <p className="text-xs text-muted-foreground">Notification when new sustainability tasks are ready.</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <div className="space-y-1">
                      <Label className="text-sm font-bold">Public Statistics</Label>
                      <p className="text-xs text-muted-foreground">Allow others to see your environmental level and rank.</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              <Card className="border-red-100 bg-red-50/30 rounded-[2.5rem] p-10">
                <CardHeader className="px-0 pt-0 pb-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-500 rounded-2xl shadow-lg shadow-red-200">
                      <ShieldAlert className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-headline font-bold text-red-600">Danger Zone</CardTitle>
                      <CardDescription>Irreversible actions related to your account.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-0 space-y-6">
                   <div className="p-8 rounded-2xl bg-white border border-red-100 space-y-4">
                      <h4 className="font-bold text-foreground">Terminate Account</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Deleting your account will permanently remove all green points, challenge progress, and historical carbon telemetry. This action cannot be undone.
                      </p>
                      <Button variant="destructive" className="rounded-xl font-bold h-12 px-8">
                        Permanently Delete Account
                      </Button>
                   </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
