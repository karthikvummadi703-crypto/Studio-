
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
  Check,
  X,
  Loader2,
  Info,
  MapPin,
  Navigation,
  ArrowRight
} from 'lucide-react';
import { collection, doc, updateDoc, increment, addDoc } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Custom SVG for Motorcycle to avoid build errors (lucide-react doesn't have a Motorcycle icon)
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
      toast({ 
        title: "Missing Information", 
        description: "Please enter both start and destination locations.", 
        variant: "destructive" 
      });
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
    }, 600);
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
        title: "Impact Saved",
        description: `Successfully added ${activeResult.points} Green Points.`,
      });

      // Reset
      setActiveResult(null);
      setStart('');
      setDestination('');
    } catch (e) {
      toast({ 
        title: "Error", 
        description: "Could not save your impact data.", 
        variant: "destructive" 
      });
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
    <div className="max-w-4xl mx-auto space-y-12 py-8 px-4 sm:px-6 animate-in fade-in duration-700">
      {/* Page Header */}
      <header className="text-center space-y-3">
        <h1 className="text-4xl font-headline font-bold text-foreground tracking-tight">
          Carbon Impact Calculator
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Calculate the environmental impact of your journey in seconds.
        </p>
      </header>

      {/* Main Form Card */}
      <Card className="bg-white/90 border border-zinc-200 shadow-sm rounded-3xl overflow-hidden">
        <CardContent className="p-8 sm:p-12 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Starting Location</Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input 
                  placeholder="e.g., Mumbai" 
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="pl-11 h-12 bg-zinc-50 border-zinc-200 rounded-xl focus-visible:ring-primary/20"
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Destination</Label>
              <div className="relative">
                <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input 
                  placeholder="e.g., Pune" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="pl-11 h-12 bg-zinc-50 border-zinc-200 rounded-xl focus-visible:ring-primary/20"
                />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Transport Method</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TRANSPORT_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-xl border transition-all gap-2",
                    selectedMode === mode.id 
                      ? "bg-primary border-primary text-primary-foreground shadow-sm" 
                      : "bg-white border-zinc-200 text-zinc-500 hover:border-primary/30 hover:bg-zinc-50"
                  )}
                >
                  <mode.icon className="h-5 w-5" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">{mode.label}</span>
                </button>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleCalculate} 
            disabled={calculating}
            className="w-full h-14 bg-primary text-primary-foreground text-lg font-headline font-bold rounded-xl shadow-lg shadow-primary/10 hover:opacity-90 transition-opacity"
          >
            {calculating ? <Loader2 className="h-5 w-5 animate-spin" /> : "Calculate My Impact"}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {activeResult && (
        <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Analytics Results Card */}
            <Card className="bg-white border border-zinc-200 shadow-sm rounded-3xl p-8 space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="font-headline font-bold text-lg">Results</h3>
                <Badge className={cn(
                  "border-none px-3 py-1 text-[10px] uppercase font-bold",
                  activeResult.impact === 'High' ? "bg-red-100 text-red-600" : activeResult.impact === 'Medium' ? "bg-orange-100 text-orange-600" : "bg-emerald-100 text-emerald-600"
                )}>
                  {activeResult.impact} Impact
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Distance</p>
                  <p className="text-3xl font-headline font-bold tabular-nums">{activeResult.distance} <span className="text-sm font-normal text-zinc-400">km</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">CO2 Emitted</p>
                  <p className="text-3xl font-headline font-bold tabular-nums text-red-500">{activeResult.co2} <span className="text-sm font-normal text-zinc-400">kg</span></p>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Impact Reward</p>
                  <p className="text-lg font-headline font-bold text-primary">+{activeResult.points} Green Points</p>
                </div>
                <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
              </div>
            </Card>

            {/* Advice Card */}
            <Card className="bg-white border border-zinc-200 shadow-sm rounded-3xl p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-zinc-100 rounded-lg">
                    <Info className="h-4 w-4 text-zinc-600" />
                  </div>
                  <h3 className="font-headline font-bold text-lg">Sustainability Advice</h3>
                </div>
                <div className={cn(
                  "p-6 rounded-2xl text-sm leading-relaxed",
                  activeResult.mode === 'walking' || activeResult.mode === 'bicycle' 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                    : "bg-zinc-50 text-zinc-600 border border-zinc-100"
                )}>
                  {adviceText}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="bg-primary text-primary-foreground h-12 rounded-xl font-bold shadow-md shadow-primary/10"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4 mr-2" /> Save Result</>}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveResult(null)} 
                  disabled={saving}
                  className="border-zinc-200 bg-white h-12 rounded-xl font-bold hover:bg-zinc-50 hover:text-red-500"
                >
                  <X className="h-4 w-4 mr-2" /> Discard
                </Button>
              </div>
            </Card>
          </div>

          {/* AI Advisor Card */}
          <Card className="bg-zinc-900 text-white rounded-[2.5rem] p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10">
              <Zap className="h-32 w-32" />
            </div>
            <div className="relative z-10 space-y-6">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-primary/20 rounded-lg">
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                 </div>
                 <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">EcoPulse AI Insight</h4>
               </div>
               <p className="text-xl font-headline font-bold leading-snug max-w-2xl">
                 If you had taken the <span className="text-primary underline decoration-2 underline-offset-4">Metro</span> instead of a {activeResult.mode}, your journey emissions would have been reduced by approximately <span className="text-primary">82%</span>.
               </p>
               <p className="text-zinc-400 text-sm">Switching just two car trips a week to the metro saves over 450kg of CO2 annually.</p>
            </div>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!activeResult && (
        <Card className="bg-white/40 border border-dashed border-zinc-200 h-64 flex flex-col items-center justify-center text-center p-12 rounded-[2.5rem] space-y-4">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Navigation className="h-8 w-8 text-zinc-300" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-headline font-bold text-zinc-500">No carbon calculations yet</h3>
            <p className="text-zinc-400 text-sm">
              Enter a route above to calculate your first environmental impact.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
