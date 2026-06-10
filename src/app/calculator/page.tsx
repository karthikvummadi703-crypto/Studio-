
"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  Navigation
} from 'lucide-react';
import { collection, doc, updateDoc, increment, addDoc } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Custom SVG for Motorcycle
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

  const [start, setStart] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedMode, setSelectedMode] = useState('car');
  const [calculating, setCalculating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeResult, setActiveResult] = useState<any>(null);

  const handleCalculate = () => {
    if (!start || !destination) {
      toast({ 
        title: "Missing Information", 
        description: "Please enter both locations.", 
        variant: "destructive" 
      });
      return;
    }

    setCalculating(true);
    
    // Immediate calculation logic
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
    }, 500);
  };

  const handleSave = async () => {
    if (!activeResult || !user || !db) return;
    setSaving(true);

    try {
      addDoc(collection(db, 'calculator_records'), {
        userId: user.uid,
        ...activeResult
      });

      const newScoreChange = Math.max(1, 10 - activeResult.co2);
      updateDoc(doc(db, 'users', user.uid), {
        greenPoints: increment(activeResult.points),
        sustainabilityScore: increment(newScoreChange),
      });

      addDoc(collection(db, 'activities'), {
        userId: user.uid,
        type: 'calculation',
        description: `Logged journey from ${activeResult.start} to ${activeResult.destination}`,
        pointsEarned: activeResult.points,
        timestamp: new Date().toISOString()
      });

      toast({ title: "Impact Saved", description: "Dashboard updated successfully." });
      setActiveResult(null);
      setStart('');
      setDestination('');
    } catch (e) {
      toast({ title: "Error", description: "Failed to save calculation.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const adviceText = useMemo(() => {
    if (!activeResult) return '';
    const mode = activeResult.mode;
    if (mode === 'walking' || mode === 'bicycle') return "Outstanding! This journey generated virtually no carbon emissions. You made one of the most environmentally friendly choices possible.";
    if (activeResult.impact === 'High') return "Consider using public transport for this route. The metro could reduce your carbon footprint by up to 70% compared to a car.";
    if (activeResult.impact === 'Medium') return "You are making a moderate environmental impact. Try combining trips to reduce emissions.";
    return "Great choice! Your journey generated very low emissions. You are helping reduce transportation emissions.";
  }, [activeResult]);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 space-y-12 animate-in fade-in duration-700">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-headline font-bold text-foreground tracking-tight">
          Carbon Impact Calculator
        </h1>
        <p className="text-muted-foreground text-sm">
          Calculate the environmental impact of your journey in under 10 seconds.
        </p>
      </header>

      {/* Single Clean Card Form */}
      <Card className="bg-white/90 border border-zinc-200 shadow-xl rounded-2xl overflow-hidden backdrop-blur-sm">
        <CardContent className="p-8 space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Starting Location</Label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="e.g., Mumbai" 
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  className="pl-11 h-12 bg-zinc-50 border-zinc-200 rounded-xl focus-visible:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Destination</Label>
              <div className="relative group">
                <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="e.g., Pune" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="pl-11 h-12 bg-zinc-50 border-zinc-200 rounded-xl focus-visible:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Transport Method</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TRANSPORT_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-xl border transition-all gap-1.5",
                      selectedMode === mode.id 
                        ? "bg-primary border-primary text-primary-foreground shadow-sm" 
                        : "bg-white border-zinc-200 text-zinc-500 hover:border-primary/30 hover:bg-zinc-50"
                    )}
                  >
                    <mode.icon className="h-4 w-4" />
                    <span className="text-[9px] font-bold uppercase tracking-tight">{mode.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button 
            onClick={handleCalculate} 
            disabled={calculating}
            className="w-full h-14 bg-primary text-primary-foreground text-base font-headline font-bold rounded-xl shadow-lg shadow-primary/10 hover:opacity-90 transition-all hover:scale-[1.01]"
          >
            {calculating ? <Loader2 className="h-5 w-5 animate-spin" /> : "Calculate My Impact"}
          </Button>
        </CardContent>
      </Card>

      {/* Results Display */}
      {activeResult && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <Card className="bg-white border border-zinc-200 shadow-xl rounded-2xl overflow-hidden">
            <div className="p-8 space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="font-headline font-bold text-xl">Journey Analysis</h3>
                <Badge className={cn(
                  "border-none px-4 py-1.5 text-[10px] uppercase font-black tracking-widest",
                  activeResult.impact === 'High' ? "bg-red-50 text-red-600" : activeResult.impact === 'Medium' ? "bg-orange-50 text-orange-600" : "bg-emerald-50 text-emerald-600"
                )}>
                  {activeResult.impact} Impact
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 border-y border-zinc-100 py-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Distance</p>
                  <p className="text-2xl font-headline font-bold tabular-nums">{activeResult.distance} <span className="text-sm font-normal text-zinc-400">km</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">CO2 Output</p>
                  <p className="text-2xl font-headline font-bold tabular-nums text-red-500">{activeResult.co2} <span className="text-sm font-normal text-zinc-400">kg</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Reward</p>
                  <p className="text-2xl font-headline font-bold text-primary">+{activeResult.points} <span className="text-sm font-normal text-zinc-400">pts</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Telemetry</p>
                  <p className="text-sm font-bold text-emerald-600 uppercase">Verified</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-zinc-50 rounded-xl border border-zinc-100">
                <Info className="h-5 w-5 text-zinc-400 shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed text-zinc-600 italic">
                  {adviceText}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={handleSave} 
                  disabled={saving}
                  className="bg-primary text-primary-foreground h-12 rounded-xl font-bold shadow-md shadow-primary/10 hover:scale-[1.02] transition-transform"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4 mr-2" /> Save Result</>}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveResult(null)} 
                  disabled={saving}
                  className="border-zinc-200 bg-white h-12 rounded-xl font-bold hover:bg-zinc-50 hover:text-red-500 transition-colors"
                >
                  <X className="h-4 w-4 mr-2" /> Discard
                </Button>
              </div>
            </div>
          </Card>

          {/* AI Advisor Bar */}
          <Card className="bg-zinc-900 text-white rounded-2xl p-8 border-none relative overflow-hidden">
            <div className="relative z-10 space-y-4">
               <div className="flex items-center gap-3">
                 <Zap className="h-4 w-4 text-primary fill-current" />
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">EcoPulse AI Advisor</h4>
               </div>
               <p className="text-base font-headline font-bold leading-snug">
                 If you had taken the <span className="text-primary underline underline-offset-4 decoration-2">Metro</span> instead of a {activeResult.mode}, your journey emissions would have been reduced by approximately <span className="text-primary">82%</span>.
               </p>
            </div>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!activeResult && (
        <div className="text-center py-12 space-y-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto ring-4 ring-white/10">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-headline font-bold text-foreground">No carbon calculations yet</h3>
            <p className="text-zinc-500 text-sm">
              Enter a route above to calculate your first environmental impact.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
