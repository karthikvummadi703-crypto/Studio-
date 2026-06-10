
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Calendar, Trophy, Sparkles, CheckCircle2 } from 'lucide-react';
import { useUser, useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { getLevelFromPoints } from '@/lib/levels';

export default function ProfilePage() {
  const { user } = useUser();
  const db = useFirestore();
  const profileRef = user && db ? doc(db, 'users', user.uid) : null;
  const { data: profile } = useDoc(profileRef);

  if (!profile) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="h-12 w-12 bg-primary/20 rounded-full" />
        <p className="text-primary font-bold uppercase tracking-widest text-[10px]">Loading Profile...</p>
      </div>
    </div>
  );

  const level = getLevelFromPoints(profile.greenPoints || 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-headline font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">Your sustainability footprint and milestones.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 glass-card border-none overflow-hidden shadow-xl">
          <CardHeader className="bg-primary/5 border-b border-black/5">
            <div className="flex items-center gap-4">
               <div className="h-20 w-20 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-headline text-4xl font-bold shadow-sm ring-4 ring-primary/5">
                 {profile.fullName?.[0] || 'E'}
               </div>
               <div>
                  <CardTitle className="font-headline text-2xl text-foreground">{profile.fullName || 'Eco Warrior'}</CardTitle>
                  <p className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
                    <Mail className="h-3 w-3" /> {profile.email}
                  </p>
               </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8 space-y-8">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em]">Sustainability Score</p>
                <p className="text-3xl font-headline font-bold text-primary emerald-glow">{profile.sustainabilityScore || 0}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em]">Green Points</p>
                <p className="text-3xl font-headline font-bold text-emerald-600">{profile.greenPoints || 0}</p>
              </div>
            </div>
            
            <Separator className="bg-black/5" />
            
            <div className="space-y-4">
               <h3 className="font-headline font-bold text-lg flex items-center gap-2 text-foreground">
                 <CheckCircle2 className="h-5 w-5 text-primary" />
                 Completed Challenges
               </h3>
               <div className="flex flex-wrap gap-3">
                 {profile.completedChallenges && profile.completedChallenges.length > 0 ? (
                   profile.completedChallenges.map((id: string) => (
                     <Badge key={id} variant="secondary" className="bg-white/60 border-black/10 px-4 py-1.5 text-muted-foreground font-bold shadow-sm">
                       {id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                     </Badge>
                   ))
                 ) : (
                   <div className="p-4 rounded-xl bg-black/5 border border-dashed border-black/10 w-full text-center">
                     <p className="text-xs text-muted-foreground italic">No challenges completed yet. Start your first one on the dashboard!</p>
                   </div>
                 )}
               </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="glass-card border-none bg-primary/5 border border-primary/20 shadow-lg">
             <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center gap-2 text-foreground">
                  <Trophy className="h-5 w-5 text-primary" />
                  Eco Level
                </CardTitle>
             </CardHeader>
             <CardContent className="text-center py-10">
                <div className="relative inline-block">
                  <Sparkles className="h-20 w-20 text-primary opacity-20 absolute -top-6 -right-6 animate-pulse" />
                  <p className="text-3xl font-headline font-bold text-primary uppercase tracking-tighter drop-shadow-sm">{level}</p>
                </div>
                <p className="text-[9px] font-bold text-muted-foreground mt-4 uppercase tracking-widest">Verified Status</p>
             </CardContent>
          </Card>

          <Card className="glass-card border-none shadow-lg">
            <CardContent className="pt-6 space-y-4">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Joined EcoPulse</p>
                    <p className="font-headline font-bold text-foreground text-sm">
                      {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'March 2024'}
                    </p>
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
