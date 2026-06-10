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
  Loader2
} from 'lucide-react';
import { collection, doc, updateDoc, increment, addDoc } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';

const steps = [
  { id: 'transport', title: 'Transportation', icon: Car },
  { id: 'energy', title: 'Home Energy', icon: Home },
  { id: 'food', title: 'Food', icon: Utensils },
  { id: 'lifestyle', title: 'Lifestyle', icon: ShoppingBag },
  { id: 'results', title: 'Results', icon: CheckCircle2 },
];

export default function CalculatorPage() {
  const { user } = useUser();
  const db = useFirestore();
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
    if (!user || !db) return;
    setLoading(true);

    // Simplified carbon calculation logic (kgCO2e)
    const transportTotal = (transport.car * 0.2) + (transport.bus * 0.05) + (transport.train * 0.03);
    const energyTotal = (energy.electricity * 0.4) + (energy.gas * 0.2);
    const foodImpact = food === 'meat' ? 250 : food === 'mixed' ? 150 : 80;
    const lifestyleImpact = (lifestyle.shopping === 'heavy' ? 100 : 50) + (lifestyle.waste === 'high' ? 50 : 20);

    const totalEmissions = transportTotal + energyTotal + foodImpact + lifestyleImpact;
    
    // Logic: Submit calculation and earn points
    const pointsEarned = 50; 
    const newScore = Math.max(10, Math.min(100, 100 - (totalEmissions / 50)));

    try {
      // 1. Save record
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

      // 2. Update profile
      updateDoc(doc(db, 'users', user.uid), {
        greenPoints: increment(pointsEarned),
        sustainabilityScore: newScore,
      });

      // 3. Log activity
      addDoc(collection(db, 'activities'), {
        userId: user.uid,
        type: 'calculation',
        description: `Submitted footprint calculation: ${totalEmissions.toFixed(0)} kgCO2e`,
        pointsEarned,
        timestamp: new Date().toISOString()
      });

      nextStep();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="mb-8 space-y-4 text-center">
        <h1 className="text-4xl font-headline font-bold">Eco Calculator</h1>
        <p className="text-muted-foreground">Analyze your impact to receive personalized reduction advice.</p>
        <div className="max-w-md mx-auto">
          <Progress value={progress} className="h-2 bg-white/5" />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground font-mono">
             <span>STEP {currentStep + 1} OF 5</span>
             <span>{Math.round(progress)}% COMPLETE</span>
          </div>
        </div>
      </div>

      <Card className="glass-card border-none overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              {(() => {
                const Icon = steps[currentStep].icon;
                return <Icon className="h-6 w-6 text-primary" />;
              })()}
            </div>
            <div>
              <CardTitle className="font-headline">{steps[currentStep].title}</CardTitle>
              <CardDescription>Enter your habits to build your profile.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {currentStep === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Car (km/week)</Label>
                <Input type="number" value={transport.car} onChange={e => setTransport({...transport, car: Number(e.target.value)})} className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label>Bus (km/week)</Label>
                <Input type="number" value={transport.bus} onChange={e => setTransport({...transport, bus: Number(e.target.value)})} className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label>Train (km/week)</Label>
                <Input type="number" value={transport.train} onChange={e => setTransport({...transport, train: Number(e.target.value)})} className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label>Bike/Walking (km/week)</Label>
                <Input type="number" value={transport.bike} onChange={e => setTransport({...transport, bike: Number(e.target.value)})} className="bg-white/5 border-white/10" />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Electricity usage (kWh/month)</Label>
                <Input type="number" value={energy.electricity} onChange={e => setEnergy({...energy, electricity: Number(e.target.value)})} className="bg-white/5 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label>Gas usage (m³/month)</Label>
                <Input type="number" value={energy.gas} onChange={e => setEnergy({...energy, gas: Number(e.target.value)})} className="bg-white/5 border-white/10" />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <Label className="text-lg">Select your primary diet</Label>
              <RadioGroup value={food} onValueChange={setFood} className="grid grid-cols-1 gap-4">
                {['vegetarian', 'mixed', 'meat'].map(f => (
                  <div key={f} className="flex items-center space-x-2 p-4 rounded-xl border border-white/10 hover:bg-primary/5 cursor-pointer transition-colors capitalize">
                    <RadioGroupItem value={f} id={f} />
                    <Label htmlFor={f} className="flex-1 cursor-pointer font-bold">{f} Diet</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-8">
               <div className="space-y-4">
                <Label className="text-lg">Shopping Frequency</Label>
                <RadioGroup value={lifestyle.shopping} onValueChange={val => setLifestyle({...lifestyle, shopping: val})} className="grid grid-cols-3 gap-2">
                   {['minimal', 'medium', 'heavy'].map(opt => (
                     <div key={opt} className="flex items-center space-x-2">
                       <RadioGroupItem value={opt} id={opt} />
                       <Label htmlFor={opt} className="capitalize">{opt}</Label>
                     </div>
                   ))}
                </RadioGroup>
               </div>
               <div className="space-y-4">
                <Label className="text-lg">Waste Production</Label>
                <RadioGroup value={lifestyle.waste} onValueChange={val => setLifestyle({...lifestyle, waste: val})} className="grid grid-cols-3 gap-2">
                   {['low', 'medium', 'high'].map(opt => (
                     <div key={opt} className="flex items-center space-x-2">
                       <RadioGroupItem value={opt} id={`waste-${opt}`} />
                       <Label htmlFor={`waste-${opt}`} className="capitalize">{opt}</Label>
                     </div>
                   ))}
                </RadioGroup>
               </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="text-center space-y-6 py-10">
               <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
               </div>
               <h2 className="text-2xl font-headline font-bold">Analysis Complete!</h2>
               <p className="text-muted-foreground">You earned <span className="text-primary font-bold">50 Green Points</span>! Your dashboard has been updated with personalized insights.</p>
               <Button onClick={() => router.push('/dashboard')} className="bg-primary text-primary-foreground h-12 px-8">Back to Dashboard</Button>
            </div>
          )}
        </CardContent>

        {currentStep < 4 && (
          <CardFooter className="flex justify-between border-t border-white/5 p-6 bg-primary/5">
            <Button variant="ghost" onClick={prevStep} disabled={currentStep === 0 || loading}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            {currentStep === 3 ? (
              <Button onClick={handleCalculate} disabled={loading} className="bg-primary text-primary-foreground px-8">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Calculate Results'}
              </Button>
            ) : (
              <Button onClick={nextStep} disabled={loading} className="bg-primary text-primary-foreground px-8">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
