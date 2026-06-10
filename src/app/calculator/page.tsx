
"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Car, 
  Bus, 
  Train, 
  Bike, 
  Footprints, 
  Zap, 
  Motorcycle, 
  TramFront,
  Sparkles,
  ArrowRight,
  Check,
  X,
  Loader2,
  Info
} from 'lucide-react';
import { collection, doc, updateDoc, increment, addDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const TRANSPORT_MODES = [
  { id: 'walking', label: 'Walking', icon: Footprints, co2PerKm: 0, points: 20 },
  { id: 'bicycle', label: 'Bicycle', icon: Bike, co2PerKm: 0, points: 15 },
  { id: 'bus', label: 'Bus', icon: Bus, co2PerKm: 0.05, points: 10 },
  { id: 'train', label: 'Train', icon: Train, co2PerKm: 0.03, points: 10 },
  { id: 'metro', label: 'Metro', icon: TramFront, co2PerKm: 0.02, points: 12 },
  { id: 'car', label: 'Car', icon: Car, co2PerKm: 0.18, points: 2 },
  { id: 'motorcycle', label: 'Motorcycle', icon: Motorcycle, co2PerKm: 0.1, points: 5 },
  { id: 'ev', label: 'Electric Vehicle', icon: Zap, co2PerKm: 0.04, points: 8 },
];

export default function CalculatorPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  // Form State
  const [start, setStart] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedMode, setSelectedMode] = useState('car');
  
  // Calculation State
  const [calculating, setCalculating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeResult, setActiveResult] = useState<any>(null);

  // Firestore History
  const historyQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'calculator_records'), 
      where('userId', '==', user.uid), 
      orderBy('timestamp', 'desc'),
      limit(1)
    );
  }, [db, user]);
  const { data: recentRecords } = useCollection(historyQuery);

  const handleCalculate = () => {
    if (!start || !destination) {
      toast({ title: "Missing Information", description: "Please enter both start and destination locations.", variant: "destructive" });
      return;
    }

    setCalculating(true);
    
    // Simulating heavy computation/API call
    setTimeout(() => {
      // Mock distance logic for prototype (random 5-50km)
      const distance = parseFloat((Math.random() * 45 + 5).toFixed(1));
      const mode = TRANSPORT_MODES.find(m => m.id === selectedMode)!;
      const co2 = parseFloat((distance * mode.co2PerKm).toFixed(2));
      
      let impact: 'Low' | 'Medium' | 'High' = 'Low';
      if (co2 > 5) impact = 'High';
      else if (co2 > 1.5) impact = 'Medium';

      setActiveResult({
        start,
        destination,
        mode: mode.id,
        distance,
        co2,
        impact,
        points: mode.points,
        timestamp: new Date().toISOString()
      });
      setCalculating(false);
    }, 800);
  };

  const handleSave = async () => {
    if (!activeResult || !user || !db) return;
    setSaving(true);

    try {
      // 1. Save Record
      addDoc(collection(db, 'calculator_records'), {
        userId: user.uid,
        ...activeResult
      });

      // 2. Update User Profile (Points & Score)
      const newScore = Math.max(10, Math.min(100, 100 - (activeResult.co2 * 2)));
      updateDoc(doc(db, 'users', user.uid), {
        greenPoints: increment(activeResult.points),
        sustainabilityScore: newScore,
      });

      // 3. Log Activity
      addDoc(collection(db, 'activities'), {
        userId: user.uid,
        type: 'calculation',
        description: `Logged a ${activeResult.distance}km journey via ${activeResult.mode}`,
        pointsEarned: activeResult.points,
        timestamp: new Date().toISOString()
      });

      toast({
        title: "Impact Saved!",
        description: `Successfully added ${activeResult.points} Green Points to your account.`,
      });

      // Clear current state and show success
      setActiveResult(null);
      setStart('');
      setDestination('');
      router.refresh();
    } catch (e) {
      toast({ title: "Error", description: "Could not save your impact data.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in duration-500">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
          <Zap className="h-3 w-3" /> 10-Second Impact Audit
        </div>
        <h1 className="text-5xl font-headline font-bold text-foreground">Carbon Calculator</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Quickly estimate the environmental footprint of your journeys and earn rewards.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Input Form Section */}
        <Card className="lg:col-span-7 glass-card border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-black/5 p-8">
            <CardTitle className="font-headline text-2xl">Journey Details</CardTitle>
          </CardHeader>
          <CardContent className="p-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Starting Location</Label>
                <div className="relative group">
                  <Input 
                    placeholder="e.g., Mumbai" 
                    value={start}
                    onChange={(e) => setStart(e.target.value)}
                    className="h-14 bg-white/40 border-black/5 rounded-2xl pl-4 pr-10 text-lg focus-visible:ring-primary/20"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <Info className="h-4 w-4" />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Destination</Label>
                <div className="relative group">
                  <Input 
                    placeholder="e.g., Pune" 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="h-14 bg-white/40 border-black/5 rounded-2xl pl-4 pr-10 text-lg focus-visible:ring-primary/20"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Transport Method</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {TRANSPORT_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-3",
                      selectedMode === mode.id 
                        ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
                        : "bg-white/40 border-black/5 text-muted-foreground hover:bg-white/60"
                    )}
                  >
                    <mode.icon className="h-6 w-6" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleCalculate} 
              disabled={calculating}
              className="w-full h-16 bg-primary text-primary-foreground text-xl font-headline font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
            >
              {calculating ? <Loader2 className="h-6 w-6 animate-spin" /> : "Calculate My Impact"}
            </Button>
          </CardContent>
        </Card>

        {/* Results & Advice Section */}
        <div className="lg:col-span-5 space-y-8">
          {activeResult ? (
            <div className="animate-in slide-in-from-right-10 duration-500 space-y-8">
              <Card className="glass-card border-none bg-primary text-primary-foreground p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Sparkles className="h-24 w-24" />
                </div>
                <div className="space-y-6 relative z-10">
                   <div className="flex justify-between items-center">
                     <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Calculation Result</p>
                     <Badge className="bg-white/20 text-white border-none">{activeResult.impact} Impact</Badge>
                   </div>
                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <p className="text-4xl font-headline font-bold">{activeResult.distance} <span className="text-sm opacity-60">km</span></p>
                        <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Distance</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-4xl font-headline font-bold">{activeResult.co2} <span className="text-sm opacity-60">kg</span></p>
                        <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">CO2 Emitted</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-2 pt-4">
                      <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-lg font-headline font-bold">+{activeResult.points} Green Points</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Ready to earn</p>
                      </div>
                   </div>
                </div>
              </Card>

              <Card className="glass-card border-none p-8 rounded-[2rem] space-y-6">
                <h3 className="font-headline font-bold text-xl flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Personalized Advice
                </h3>
                <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 italic text-sm leading-relaxed text-foreground">
                  {activeResult.mode === 'walking' || activeResult.mode === 'bicycle' 
                    ? "Outstanding! This journey generated virtually no carbon emissions. You made the most environmentally friendly choice possible."
                    : activeResult.impact === 'High' 
                    ? "Consider using public transport for this route. The metro could reduce your carbon footprint by up to 70% compared to a car."
                    : "You are making a moderate environmental impact. Try combining trips to reduce your overall weekly emissions."
                  }
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="bg-primary text-primary-foreground h-12 rounded-xl font-bold shadow-lg shadow-primary/20"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4 mr-2" /> Save Result</>}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveResult(null)} 
                    disabled={saving}
                    className="border-black/5 bg-white/40 h-12 rounded-xl font-bold hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-4 w-4 mr-2" /> Discard
                  </Button>
                </div>
              </Card>

              <Card className="glass-card border-none p-8 rounded-[2rem] bg-secondary/30 relative overflow-hidden">
                 <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-primary/20 rounded-lg">
                    <Sparkles className="h-4 w-4 text-primary" />
                   </div>
                   <h4 className="text-sm font-bold uppercase tracking-widest text-primary">AI Advisor Insights</h4>
                 </div>
                 <p className="text-xs text-muted-foreground leading-relaxed">
                   Based on your selection of {activeResult.mode}, we estimate that switching to the metro for this specific {activeResult.distance}km journey would save you approximately {Math.max(0, activeResult.co2 - 0.5).toFixed(1)}kg of CO2 today.
                 </p>
              </Card>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <Card className="glass-card border-none flex-1 flex flex-col items-center justify-center text-center p-12 rounded-[2.5rem] space-y-6">
                <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center ring-8 ring-primary/5">
                  <CalculatorIcon className="h-10 w-10 text-primary/40" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-headline font-bold text-foreground">No calculations yet</h3>
                  <p className="text-muted-foreground max-w-[250px] mx-auto text-sm">
                    Enter a route on the left to calculate your first environmental impact.
                  </p>
                </div>
              </Card>
              
              {recentRecords && recentRecords.length > 0 && (
                <div className="mt-8 space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-4">Last Audit</p>
                  <div className="glass-card border-none p-4 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        {(() => {
                          const RecordIcon = TRANSPORT_MODES.find(m => m.id === recentRecords[0].mode)?.icon || Car;
                          return <RecordIcon className="h-4 w-4" />;
                        })()}
                      </div>
                      <div>
                        <p className="text-xs font-bold">{recentRecords[0].start} to {recentRecords[0].destination}</p>
                        <p className="text-[9px] text-muted-foreground uppercase">{recentRecords[0].distance}km journey</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[10px] text-primary">{recentRecords[0].co2}kg CO2</Badge>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CalculatorIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" y2="18" />
      <path d="M16 10h.01" />
      <path d="M12 10h.01" />
      <path d="M8 10h.01" />
      <path d="M12 14h.01" />
      <path d="M8 14h.01" />
      <path d="M12 18h.01" />
      <path d="M8 18h.01" />
    </svg>
  );
}
