"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Bell, Shield, LogOut, Trash2 } from 'lucide-react';
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push('/login');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <header>
        <h1 className="text-4xl font-headline font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and platform preferences.</p>
      </header>

      <div className="grid gap-6">
        <Card className="glass-card border-none">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>Control how you receive alerts and reports.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Summary</Label>
                <p className="text-xs text-muted-foreground">Receive a performance report every Monday.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-white/5" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Challenge Alerts</Label>
                <p className="text-xs text-muted-foreground">Be notified when new sustainability challenges are available.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Privacy
            </CardTitle>
            <CardDescription>Manage your data visibility.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Public Profile</Label>
                <p className="text-xs text-muted-foreground">Allow others to see your Green Points and level.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4 pt-4">
          <Button variant="ghost" className="w-fit text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout from EcoPulse
          </Button>
          
          <Card className="glass-card border-none border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="font-headline text-destructive flex items-center gap-2 text-lg">
                <Trash2 className="h-5 w-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
               <p className="text-sm text-muted-foreground mb-4">Deleting your account is permanent and will remove all your green points and progress.</p>
               <Button variant="destructive">Delete Account</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
