
"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Sparkles, 
  TrendingDown, 
  Lightbulb, 
  Globe, 
  Leaf, 
  Zap,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { useUser, useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';

const EDUCATIONAL_TOPICS = [
  {
    title: "Carbon Footprint Basics",
    desc: "Understand the core concepts of carbon footprints and why tracking is the first step toward environmental preservation.",
    icon: Globe,
    category: "Essentials",
    readTime: "5 min"
  },
  {
    title: "The Science of Climate",
    desc: "A deep dive into the thermal dynamics of our atmosphere and the impact of greenhouse gas concentration.",
    icon: TrendingDown,
    category: "Science",
    readTime: "8 min"
  },
  {
    title: "Sustainable Daily Life",
    desc: "Actionable micro-habits that lead to macro environmental shifts. Small changes, global impact.",
    icon: Leaf,
    category: "Lifestyle",
    readTime: "4 min"
  },
  {
    title: "Renewable Transitions",
    desc: "How the world is shifting from fossil fuels to clean energy and what role you play in the grid.",
    icon: Zap,
    category: "Energy",
    readTime: "6 min"
  },
  {
    title: "The Zero-Waste Model",
    desc: "Techniques for eliminating personal waste and understanding the circular economy in modern society.",
    icon: Globe,
    category: "Waste",
    readTime: "7 min"
  }
];

export default function KnowledgeHubPage() {
  const { user } = useUser();
  const db = useFirestore();

  const recordsQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, 'calculator_records'), orderBy('timestamp', 'desc'), limit(1));
  }, [db, user]);

  const { data: latestRecords } = useCollection(recordsQuery);
  const latestRecord = latestRecords?.[0];

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
            <Info className="h-3 w-3" /> Learning Center
          </div>
          <h1 className="text-5xl font-headline font-bold text-foreground">Knowledge Hub</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Expert guidance and personalized insights for your sustainability journey.
          </p>
        </div>
      </header>

      <Tabs defaultValue="educational" className="w-full">
        <TabsList className="bg-black/5 p-1.5 rounded-2xl h-auto mb-10 inline-flex border border-black/5">
          <TabsTrigger value="educational" className="py-3 px-8 rounded-xl font-headline text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
             <BookOpen className="mr-2 h-5 w-5" /> Educational Library
          </TabsTrigger>
          <TabsTrigger value="personalized" className="py-3 px-8 rounded-xl font-headline text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
             <Sparkles className="mr-2 h-5 w-5" /> Personalized Impact
          </TabsTrigger>
        </TabsList>

        <TabsContent value="educational" className="animate-in fade-in duration-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {EDUCATIONAL_TOPICS.map((topic, i) => (
              <Card key={i} className="glass-card border-none hover:bg-black/5 transition-all cursor-pointer group flex flex-col hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary/20 transition-colors">
                      <topic.icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="outline" className="text-[10px] uppercase border-primary/20 text-primary">{topic.readTime}</Badge>
                  </div>
                  <Badge variant="secondary" className="w-fit text-[10px] uppercase mb-2 bg-black/5 border-black/5 text-muted-foreground">{topic.category}</Badge>
                  <CardTitle className="font-headline text-2xl group-hover:text-primary transition-colors text-foreground">{topic.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground leading-relaxed">{topic.desc}</p>
                </CardContent>
                <CardContent className="pt-0">
                   <Button variant="ghost" className="w-full justify-between text-primary font-bold px-0 hover:bg-transparent group/btn">
                      Read Article <ArrowUpRight className="h-4 w-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                   </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="personalized" className="animate-in fade-in duration-700">
          {latestRecord ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="glass-card border-none bg-primary/5 border border-primary/10">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl flex items-center gap-3 text-foreground">
                    <TrendingDown className="h-7 w-7 text-primary" />
                    Impact Breakdown
                  </CardTitle>
                  <CardDescription>Generated from your audit on {new Date(latestRecord.timestamp).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pt-4">
                  <div className="p-6 rounded-3xl bg-background/40 border border-black/5 text-center">
                    <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">Current Footprint</p>
                    <p className="text-6xl font-headline font-bold text-primary">{latestRecord.totalEmissions.toFixed(1)} <span className="text-xl">kgCO2e</span></p>
                  </div>
                  <div className="space-y-6">
                    {Object.entries(latestRecord.breakdown).map(([key, val]: [string, any]) => (
                      <div key={key} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="capitalize font-bold text-sm tracking-wide text-foreground">{key.replace('home', 'Home ')}</span>
                          <span className="font-mono text-primary font-bold">{((val / latestRecord.totalEmissions) * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={(val / latestRecord.totalEmissions) * 100} className="h-2 bg-black/5" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-8">
                <Card className="glass-card border-none border border-primary/20 relative overflow-hidden h-fit">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Sparkles className="h-32 w-32 text-primary" />
                  </div>
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-3 text-foreground">
                      <Lightbulb className="h-7 w-7 text-primary" />
                      Strategic Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="p-6 rounded-3xl bg-primary/10 border border-primary/20 italic text-lg leading-relaxed text-foreground">
                      {latestRecord.breakdown.transportation > latestRecord.breakdown.homeEnergy ? 
                        `"Your transportation sector accounts for ${((latestRecord.breakdown.transportation / latestRecord.totalEmissions) * 100).toFixed(0)}% of your footprint. Switching to public transport just twice a week could reduce your overall annual emissions by 18%."` :
                        `"Home energy is your biggest impact at ${((latestRecord.breakdown.homeEnergy / latestRecord.totalEmissions) * 100).toFixed(0)}%. Installing a smart thermostat and improving insulation could save you up to 300kg of CO2 per year."`
                      }
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="p-5 rounded-2xl bg-black/5 space-y-2">
                          <p className="text-xs font-bold uppercase tracking-widest text-primary">Top Action</p>
                          <p className="font-bold text-foreground">Renewable Switch</p>
                          <Badge className="bg-primary/20 text-primary border-none">High Impact</Badge>
                       </div>
                       <div className="p-5 rounded-2xl bg-black/5 space-y-2">
                          <p className="text-xs font-bold uppercase tracking-widest text-accent">Efficiency</p>
                          <p className="font-bold text-foreground">Smart Heating</p>
                          <Badge className="bg-accent/20 text-accent border-none">Med Impact</Badge>
                       </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-card border-none bg-secondary/20">
                   <CardHeader>
                     <CardTitle className="font-headline text-xl text-foreground">Future Projection</CardTitle>
                   </CardHeader>
                   <CardContent>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        If you implement our top three recommendations, your sustainability score will likely increase to <span className="text-foreground font-bold">85/100</span> by next quarter.
                      </p>
                   </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="glass-card border-none text-center py-24">
              <CardContent className="space-y-6">
                <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="h-10 w-10 text-muted-foreground opacity-30" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-headline font-bold text-foreground">Insights Locked</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">Complete your first impact audit to unlock hyper-personalized carbon analysis and reduction strategies.</p>
                </div>
                <Button asChild className="h-12 px-10 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20">
                  <Link href="/calculator">Start Impact Audit</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
