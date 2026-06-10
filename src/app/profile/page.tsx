"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Calendar, Shield, Bell } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProfile() {
      if (auth.currentUser) {
        const docSnap = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (docSnap.exists()) setUserData(docSnap.data());
      }
    }
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    if (auth.currentUser) {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        fullName: userData.fullName
      });
      toast({ title: "Profile updated" });
    }
  };

  if (!userData) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-4xl font-headline font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account and sustainability preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 glass-card border-none">
          <CardHeader>
            <CardTitle className="font-headline">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input 
                  value={userData.fullName} 
                  onChange={e => setUserData({...userData, fullName: e.target.value})}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input value={userData.email} disabled className="bg-white/5 border-white/10 opacity-50" />
              </div>
            </div>
            <Separator className="bg-white/5" />
            <div className="space-y-4">
               <h3 className="font-headline font-bold text-lg flex items-center gap-2">
                 <Shield className="h-5 w-5 text-primary" />
                 Privacy & Security
               </h3>
               <div className="flex items-center justify-between">
                 <div>
                   <p className="font-medium">Public Profile</p>
                   <p className="text-xs text-muted-foreground">Allow others to see your carbon reduction rank.</p>
                 </div>
                 <Switch />
               </div>
               <div className="flex items-center justify-between">
                 <div>
                   <p className="font-medium">Two-Factor Authentication</p>
                   <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
                 </div>
                 <Switch />
               </div>
            </div>
          </CardContent>
          <CardFooter className="border-t border-white/5 pt-6">
            <Button onClick={handleUpdate} className="bg-primary text-primary-foreground">Save Changes</Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card className="glass-card border-none">
             <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notifications
                </CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                   <Label className="text-sm">Email Reports</Label>
                   <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                   <Label className="text-sm">Milestone Alerts</Label>
                   <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                   <Label className="text-sm">AI Reminders</Label>
                   <Switch />
                </div>
             </CardContent>
          </Card>

          <Card className="glass-card border-none bg-primary/5">
            <CardContent className="pt-6 space-y-4">
               <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold">Joined EcoPulse</p>
                    <p className="font-headline font-bold">{new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                  </div>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
