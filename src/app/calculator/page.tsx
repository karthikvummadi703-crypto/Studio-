
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
  TramFront,
  Sparkles,
  ArrowRight,
  Check,
  X,
  Loader2,
  Info,
  Calculator as CalculatorIcon
} from 'lucide-react';
import { collection, doc, updateDoc, increment, addDoc } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Custom SVG for Motorcycle to avoid build errors
const MotorcycleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="7" cy="15" r="3" />
    <circle cx="18" cy="15" r="3" />
    <path d="M18 15V8a2 2 0 0 0-2-2H9.5a3 3 0 0 0-3 3v6" />
    <path d="M9.5 9h5" />
    <path d="M12 6V3" />
  </svg>
);

const TRANSPORT_MODES = [
  { id: 'walking', label: 'Walking', icon: Footprints, co2PerKm: 0, points: 20 },
  { id: 'bicycle', label: 'Bicycle', icon: Bike, co2PerKm: 0, points: 15 },
  { id: 'bus', label: 'Bus', icon: Bus, co2PerKm: 0.05, points: 10 },
  { id: 'train', label: 'Train', icon: Train, co2PerKm: 0.03, points: 10 },
  { id: 'metro', label: 'Metro', icon: TramFront, co2PerKm: 0.02, points: 12 },
  { id: 'car', label: 'Car', icon: Car, co2PerKm: 0.18, points: 2 },
  { id: 'motorcycle', label: 'Motorcycle', icon: MotorcycleIcon, co2PerKm: 0.1, points: 5 },
  { id: 'ev', label: 'Electric Vehicle', icon: Zap, co2PerKm: 0.04, points: 8 },
];

export default function CalculatorPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  // Form State
  const [start, setStart] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedMode, setSelectedMode] = useState('car');
  
  // Calculation State
  const [calculating, setCalculating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeResult, setActiveResult] = useState<any>(null);

  const handleCalculate = () => {
    if (!start || !destination) {
      toast({ title: "Missing Information", description: "Please enter both start and destination locations.", variant: "destructive" });
      return;
    }

    setCalculating(true);
    
    // Simulate calculation logic
    setTimeout(() => {
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
      const newScoreChange = Math.max(1, 10 - activeResult.co2);
      updateDoc(doc(db, 'users', user.uid), {
        greenPoints: increment(activeResult.points),
        sustainabilityScore: increment(newScoreChange),
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

      // Reset
      setActiveResult(null);
      setStart('');
      setDestination('');
    } catch (e) {
      toast({ title: "Error", description: "Could not save your impact data.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const adviceText = useMemo(() => {
    if (!activeResult) return '';
    const mode = activeResult.mode;
    if (mode === 'walking' || mode === 'bicycle') return "Outstanding! This journey generated virtually no carbon emissions. You made one of the most environmentally friendly choices possible.";
    if (activeResult.impact === 'High') return "Consider using public transport for this route. The metro could reduce your carbon footprint by up to 70% compared to a car.";
    if (activeResult.impact === 'Medium') return "You are making a moderate environmental impact. Try combining trips to reduce your overall weekly emissions.";
    return "Great choice! Your journey generated very low emissions. You are helping reduce transportation emissions.";
  }, [activeResult]);

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
          <Zap className="h-3 w-3" /> 10-Second Impact Audit
        </div>
        <h1 className="text-4xl font-headline font-bold text-foreground">Carbon Calculator</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Enter your route details to instantly estimate your environmental impact.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* INPUT SECTION */}
        <Card className="lg:col-span-7 glass-card border-none rounded-[2rem] overflow-hidden">
          <CardHeader className="bg-primary/5 p-8 border-b border-black/5">
            <CardTitle className="font-headline text-xl">Journey Audit</CardTitle>
          </CardHeader>
          <CardContent className="p-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Starting Location</Label>
                <Input 
                  placeholder="e.g., Mumbai" 
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="h-14 bg-white/50 border-black/5 rounded-2xl focus-visible:ring-primary/20 text-lg"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Destination</Label>
                <Input 
                  placeholder="e.g., Pune" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="h-14 bg-white/50 border-black/5 rounded-2xl focus-visible:ring-primary/20 text-lg"
                />
              </div>
            </div>

            <div className="space-y-6">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Transport Method</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {TRANSPORT_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-2xl border transition-all gap-3",
                      selectedMode === mode.id 
                        ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105" 
                        : "bg-white/40 border-black/5 text-muted-foreground hover:bg-white/60"
                    )}
                  >
                    <mode.icon className="h-6 w-6" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleCalculate} 
              disabled={calculating}
              className="w-full h-16 bg-primary text-primary-foreground text-xl font-headline font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.01] transition-transform"
            >
              {calculating ? <Loader2 className="h-6 w-6 animate-spin" /> : "Calculate My Impact"}
            </Button>
          </CardContent>
        </Card>

        {/* RESULTS SECTION */}
        <div className="lg:col-span-5 space-y-8">
          {activeResult ? (
            <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
              <Card className="glass-card border-none bg-primary text-primary-foreground p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Sparkles className="h-24 w-24" />
                </div>
                <div className="relative z-10 space-y-6">
                   <div className="flex justify-between items-center">
                     <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Audit Results</p>
                     <Badge className={cn(
                       "border-none text-white",
                       activeResult.impact === 'High' ? "bg-red-500" : activeResult.impact === 'Medium' ? "bg-orange-400" : "bg-emerald-400"
                     )}>
                       {activeResult.impact} Impact
                     </Badge>
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
                   <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                      <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-lg font-headline font-bold">+{activeResult.points} Green Points</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Impact Reward</p>
                      </div>
                   </div>
                </div>
              </Card>

              <Card className="glass-card border-none p-8 rounded-[2rem] space-y-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Info className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-headline font-bold text-lg">Personalized Advice</h3>
                </div>
                <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 italic text-sm leading-relaxed text-foreground">
                  {adviceText}
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
                   <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary">AI Insights</h4>
                 </div>
                 <p className="text-xs text-muted-foreground leading-relaxed">
                   If you had taken the <span className="text-primary font-bold">Metro</span> instead of a {activeResult.mode}, your emissions would have been reduced by approximately <span className="text-primary font-bold">82%</span>.
                 </p>
              </Card>
            </div>
          ) : (
            <Card className="glass-card border-none h-full flex flex-col items-center justify-center text-center p-12 rounded-[2.5rem] space-y-6">
              <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto ring-8 ring-primary/5">
                <CalculatorIcon className="h-10 w-10 text-primary/40" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-headline font-bold text-foreground">No carbon calculations yet</h3>
                <p className="text-muted-foreground max-w-[250px] mx-auto text-sm">
                  Enter a route on the left to calculate your first environmental impact audit.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
