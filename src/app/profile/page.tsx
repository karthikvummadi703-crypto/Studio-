
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
  const { data: profile } = useDoc(user ? doc(db!, 'users', user.uid) : null);

  if (!profile) return null;

  const level = getLevelFromPoints(profile.greenPoints || 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-4xl font-headline font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground">Your sustainability footprint and milestones.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 glass-card border-none overflow-hidden">
          <CardHeader className="bg-primary/5">
            <div className="flex items-center gap-4">
               <div className="h-20 w-20 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-headline text-4xl font-bold">
                 {profile.fullName?.[0]}
               </div>
               <div>
                  <CardTitle className="font-headline text-2xl text-foreground">{profile.fullName}</CardTitle>
                  <p className="text-muted-foreground text-sm flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {profile.email}
                  </p>
               </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Sustainability Score</p>
                <p className="text-2xl font-headline font-bold text-primary">{profile.sustainabilityScore || 0}/100</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">Green Points</p>
                <p className="text-2xl font-headline font-bold text-accent">{profile.greenPoints || 0}</p>
              </div>
            </div>
            
            <Separator className="bg-black/5" />
            
            <div className="space-y-4">
               <h3 className="font-headline font-bold text-lg flex items-center gap-2 text-foreground">
                 <CheckCircle2 className="h-5 w-5 text-primary" />
                 Completed Challenges
               </h3>
               <div className="flex flex-wrap gap-2">
                 {profile.completedChallenges && profile.completedChallenges.length > 0 ? (
                   profile.completedChallenges.map((id: string) => (
                     <Badge key={id} variant="secondary" className="bg-black/5 border-black/10 px-3 py-1 text-muted-foreground">
                       {id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                     </Badge>
                   ))
                 ) : (
                   <p className="text-sm text-muted-foreground italic">No challenges completed yet. Start your first one on the dashboard!</p>
                 )}
               </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="glass-card border-none bg-primary/5 border border-primary/20">
             <CardHeader>
                <CardTitle className="font-headline text-lg flex items-center gap-2 text-foreground">
                  <Trophy className="h-5 w-5 text-primary" />
                  Eco Level
                </CardTitle>
             </CardHeader>
             <CardContent className="text-center py-6">
                <div className="relative inline-block">
                  <Sparkles className="h-20 w-20 text-primary opacity-20 absolute -top-4 -right-4 animate-pulse" />
                  <p className="text-3xl font-headline font-bold text-primary uppercase tracking-tighter">{level}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-4">Verified Eco-Warrior Status</p>
             </CardContent>
          </Card>

          <Card className="glass-card border-none">
            <CardContent className="pt-6 space-y-4">
               <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">Joined EcoPulse</p>
                    <p className="font-headline font-bold text-foreground">
                      {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}
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
