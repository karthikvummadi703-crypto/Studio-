
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Bell, Shield, Moon, Trash2, LogOut } from 'lucide-react';
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
                <Label>Weekly Reports</Label>
                <p className="text-xs text-muted-foreground">Get a summary of your sustainability progress every Monday.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-white/5" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Challenge Alerts</Label>
                <p className="text-xs text-muted-foreground">Be notified when new challenges are unlocked.</p>
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
            <CardDescription>Manage your data visibility and sharing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Public Leaderboard</Label>
                <p className="text-xs text-muted-foreground">Allow others to see your Green Points and Level.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="font-headline text-destructive flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>Irreversible actions for your account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <Button variant="destructive" className="w-full sm:w-auto">Delete Account</Button>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout from EcoPulse
          </Button>
        </div>
      </div>
    </div>
  );
}
