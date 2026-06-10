
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { 
  Car, 
  Home, 
  Utensils, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2,
  Loader2,
  Sparkles
} from 'lucide-react';
import { collection, doc, updateDoc, increment, addDoc } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const steps = [
  { id: 'transport', title: 'Transportation', icon: Car, description: 'How do you get around each week?' },
  { id: 'energy', title: 'Home Energy', icon: Home, description: 'Estimate your monthly energy usage.' },
  { id: 'food', title: 'Food & Diet', icon: Utensils, description: 'What does your daily diet look like?' },
  { id: 'lifestyle', title: 'Lifestyle & Waste', icon: ShoppingBag, description: 'Your consumption and waste habits.' },
  { id: 'results', title: 'Impact Results', icon: CheckCircle2, description: 'Your personalized carbon analysis.' },
];

export default function CalculatorPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Form states
  const [transport, setTransport] = useState({ car: 0, bus: 0, train: 0, bike: 0 });
  const [energy, setEnergy] = useState({ electricity: 0, gas: 0 });
  const [food, setFood] = useState('mixed');
  const [lifestyle, setLifestyle] = useState({ shopping: 'medium', waste: 'medium' });

  const progress = ((currentStep + 1) / steps.length) * 100;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleCalculate = async () => {
    setLoading(true);

    // Simplified carbon calculation logic (kgCO2e)
    const transportTotal = (transport.car * 0.2) + (transport.bus * 0.05) + (transport.train * 0.03);
    const energyTotal = (energy.electricity * 0.4) + (energy.gas * 0.2);
    const foodImpact = food === 'meat' ? 250 : food === 'mixed' ? 150 : 80;
    const lifestyleImpact = (lifestyle.shopping === 'heavy' ? 100 : 50) + (lifestyle.waste === 'high' ? 50 : 20);

    const totalEmissions = transportTotal + energyTotal + foodImpact + lifestyleImpact;
    const pointsEarned = 50; 
    const newScore = Math.max(10, Math.min(100, 100 - (totalEmissions / 50)));

    if (user && db) {
      try {
        addDoc(collection(db, 'calculator_records'), {
          userId: user.uid,
          totalEmissions,
          breakdown: {
            transportation: transportTotal,
            homeEnergy: energyTotal,
            food: foodImpact,
            lifestyle: lifestyleImpact
          },
          timestamp: new Date().toISOString()
        });

        updateDoc(doc(db, 'users', user.uid), {
          greenPoints: increment(pointsEarned),
          sustainabilityScore: newScore,
        });

        addDoc(collection(db, 'activities'), {
          userId: user.uid,
          type: 'calculation',
          description: `Completed Impact Audit: ${totalEmissions.toFixed(0)} kgCO2e`,
          pointsEarned,
          timestamp: new Date().toISOString()
        });

        toast({
          title: "Calculation Saved!",
          description: `You've earned ${pointsEarned} Green Points.`,
        });
      } catch (e) {
        console.error(e);
      }
    }

    // In demo mode, we just proceed to results even if user is null
    setTimeout(() => {
      setLoading(false);
      nextStep();
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 animate-in fade-in duration-500">
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-2">
          <Sparkles className="h-3 w-3" /> Step {currentStep + 1} of 5
        </div>
        <h1 className="text-5xl font-headline font-bold">Impact Audit</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {steps[currentStep].description}
        </p>
        <div className="max-w-md mx-auto pt-4">
          <Progress value={progress} className="h-1.5 bg-white/5" />
        </div>
      </div>

      <Card className="glass-card border-none overflow-hidden shadow-2xl">
        <CardHeader className="bg-primary/5 border-b border-white/5 py-8 px-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-2xl ring-4 ring-primary/5">
              {(() => {
                const Icon = steps[currentStep].icon;
                return <Icon className="h-7 w-7 text-primary" />;
              })()}
            </div>
            <div>
              <CardTitle className="font-headline text-2xl">{steps[currentStep].title}</CardTitle>
              <CardDescription className="text-base">Provide accurate estimates for a better analysis.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-10 min-h-[400px]">
          {currentStep === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Personal Car (km/week)</Label>
                <Input type="number" value={transport.car} onChange={e => setTransport({...transport, car: Number(e.target.value)})} className="bg-white/5 border-white/10 h-12 text-lg" />
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Bus / Coach (km/week)</Label>
                <Input type="number" value={transport.bus} onChange={e => setTransport({...transport, bus: Number(e.target.value)})} className="bg-white/5 border-white/10 h-12 text-lg" />
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Train / Subway (km/week)</Label>
                <Input type="number" value={transport.train} onChange={e => setTransport({...transport, train: Number(e.target.value)})} className="bg-white/5 border-white/10 h-12 text-lg" />
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Bicycle / Walking (km/week)</Label>
                <Input type="number" value={transport.bike} onChange={e => setTransport({...transport, bike: Number(e.target.value)})} className="bg-white/5 border-white/10 h-12 text-lg" />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-8 max-w-xl mx-auto">
              <div className="space-y-3">
                <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Electricity usage (kWh/month)</Label>
                <Input type="number" value={energy.electricity} onChange={e => setEnergy({...energy, electricity: Number(e.target.value)})} className="bg-white/5 border-white/10 h-14 text-xl" />
                <p className="text-xs text-muted-foreground">Average household: 250-400 kWh</p>
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Gas usage (m³/month)</Label>
                <Input type="number" value={energy.gas} onChange={e => setEnergy({...energy, gas: Number(e.target.value)})} className="bg-white/5 border-white/10 h-14 text-xl" />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-8 max-w-xl mx-auto">
              <Label className="text-xl font-bold text-center block">Select your primary diet profile</Label>
              <RadioGroup value={food} onValueChange={setFood} className="grid grid-cols-1 gap-4">
                {[
                  { id: 'vegetarian', label: 'Plant-Focused', desc: 'Vegetarian or Vegan lifestyle' },
                  { id: 'mixed', label: 'Balanced', desc: 'Moderate meat and plant consumption' },
                  { id: 'meat', label: 'Meat-Forward', desc: 'Daily meat consumption' },
                ].map(f => (
                  <div key={f.id} className="relative">
                    <RadioGroupItem value={f.id} id={f.id} className="peer sr-only" />
                    <Label htmlFor={f.id} className="flex flex-col p-6 rounded-2xl border-2 border-white/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all hover:bg-white/5">
                      <span className="font-bold text-lg mb-1">{f.label}</span>
                      <span className="text-sm text-muted-foreground">{f.desc}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-12 max-w-xl mx-auto">
               <div className="space-y-6">
                <Label className="text-lg font-bold">Shopping Frequency</Label>
                <RadioGroup value={lifestyle.shopping} onValueChange={val => setLifestyle({...lifestyle, shopping: val})} className="grid grid-cols-3 gap-3">
                   {['minimal', 'medium', 'heavy'].map(opt => (
                     <div key={opt}>
                       <RadioGroupItem value={opt} id={`shop-${opt}`} className="peer sr-only" />
                       <Label htmlFor={`shop-${opt}`} className="flex items-center justify-center py-4 rounded-xl border border-white/10 peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground capitalize cursor-pointer font-bold transition-all">
                         {opt}
                       </Label>
                     </div>
                   ))}
                </RadioGroup>
               </div>
               <div className="space-y-6">
                <Label className="text-lg font-bold">Waste Production</Label>
                <RadioGroup value={lifestyle.waste} onValueChange={val => setLifestyle({...lifestyle, waste: val})} className="grid grid-cols-3 gap-3">
                   {['low', 'medium', 'high'].map(opt => (
                     <div key={opt}>
                       <RadioGroupItem value={opt} id={`waste-${opt}`} className="peer sr-only" />
                       <Label htmlFor={`waste-${opt}`} className="flex items-center justify-center py-4 rounded-xl border border-white/10 peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground capitalize cursor-pointer font-bold transition-all">
                         {opt}
                       </Label>
                     </div>
                   ))}
                </RadioGroup>
               </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="text-center space-y-8 py-12 animate-in zoom-in duration-500">
               <div className="w-24 h-24 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-6 ring-8 ring-primary/5">
                  <CheckCircle2 className="h-12 w-12 text-primary" />
               </div>
               <div className="space-y-2">
                 <h2 className="text-4xl font-headline font-bold">Audit Complete</h2>
                 <p className="text-muted-foreground text-lg">Your data has been processed using our sustainability engine.</p>
               </div>
               <div className="flex items-center justify-center gap-6 py-4">
                  <div className="text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Earned</p>
                    <p className="text-3xl font-headline font-bold text-primary">+50 pts</p>
                  </div>
                  <div className="h-10 w-px bg-white/10" />
                  <div className="text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                    <p className="text-3xl font-headline font-bold text-white">Verified</p>
                  </div>
               </div>
               <Button onClick={() => router.push('/dashboard')} className="bg-primary text-primary-foreground h-14 px-12 text-lg font-bold shadow-lg shadow-primary/20 rounded-2xl">
                 Return to Dashboard
               </Button>
            </div>
          )}
        </CardContent>

        {currentStep < 4 && (
          <CardFooter className="flex justify-between border-t border-white/5 p-8 bg-background/40">
            <Button variant="ghost" onClick={prevStep} disabled={currentStep === 0 || loading} className="h-12 px-6 rounded-xl">
              <ArrowLeft className="mr-2 h-5 w-5" /> Previous
            </Button>
            {currentStep === 3 ? (
              <Button onClick={handleCalculate} disabled={loading} className="bg-primary text-primary-foreground h-12 px-10 rounded-xl font-bold">
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Finalize Audit'}
              </Button>
            ) : (
              <Button onClick={nextStep} disabled={loading} className="bg-primary text-primary-foreground h-12 px-10 rounded-xl font-bold">
                Continue <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
