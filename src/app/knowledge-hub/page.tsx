"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Sparkles, TrendingDown, Lightbulb, Globe, Leaf } from 'lucide-react';
import { useUser, useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';

const EDUCATIONAL_TOPICS = [
  {
    title: "Carbon Footprint Basics",
    desc: "Understand what a carbon footprint is and why tracking it matters for the planet.",
    icon: Globe,
    category: "Essentials"
  },
  {
    title: "Climate Change 101",
    desc: "The science behind global warming and the urgent need for collective action.",
    icon: TrendingDown,
    category: "Science"
  },
  {
    title: "Sustainable Living",
    desc: "Small daily habits that lead to a significantly smaller environmental impact.",
    icon: Leaf,
    category: "Lifestyle"
  },
  {
    title: "Renewable Energy",
    desc: "The transition from fossil fuels to clean energy sources like solar and wind.",
    icon: Sparkles,
    category: "Energy"
  },
  {
    title: "Waste Reduction",
    desc: "Techniques for zero-waste living and effective recycling programs.",
    icon: Globe,
    category: "Waste"
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
    <div className="space-y-8 pb-20">
      <header>
        <h1 className="text-4xl font-headline font-bold">Knowledge Hub</h1>
        <p className="text-muted-foreground">Expert guidance and personalized insights for your sustainability journey.</p>
      </header>

      <Tabs defaultValue="educational" className="w-full">
        <TabsList className="bg-white/5 p-1 rounded-xl h-auto mb-8">
          <TabsTrigger value="educational" className="py-3 px-6 rounded-lg font-headline">
             <BookOpen className="mr-2 h-4 w-4" /> Educational Content
          </TabsTrigger>
          <TabsTrigger value="personalized" className="py-3 px-6 rounded-lg font-headline">
             <Sparkles className="mr-2 h-4 w-4" /> Personalized Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="educational" className="animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EDUCATIONAL_TOPICS.map((topic, i) => (
              <Card key={i} className="glass-card border-none hover:bg-white/10 transition-colors cursor-pointer group">
                <CardHeader>
                  <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                    <topic.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="outline" className="w-fit text-[10px] uppercase mb-2 border-primary/20">{topic.category}</Badge>
                  <CardTitle className="font-headline text-xl">{topic.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{topic.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="personalized" className="animate-in fade-in duration-500">
          {latestRecord ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card border-none bg-primary/5">
                <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-primary" />
                    Impact Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground">
                    Your footprint of <span className="text-primary font-bold">{latestRecord.totalEmissions.toFixed(1)} kgCO2e</span> is primarily driven by:
                  </p>
                  <div className="space-y-4">
                    {Object.entries(latestRecord.breakdown).map(([key, val]: [string, any]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="capitalize">{key.replace('home', 'Home ')}</span>
                          <span className="font-mono">{((val / latestRecord.totalEmissions) * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={(val / latestRecord.totalEmissions) * 100} className="h-1" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-none border border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="h-20 w-20 text-primary" />
                </div>
                <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Strategic Advice
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 rounded-xl bg-background/50 border border-white/5 italic text-sm leading-relaxed text-muted-foreground">
                    {latestRecord.breakdown.transportation > latestRecord.breakdown.homeEnergy ? 
                      `"Your transportation sector accounts for ${((latestRecord.breakdown.transportation / latestRecord.totalEmissions) * 100).toFixed(0)}% of your footprint. Switching to public transport just twice a week could reduce your overall annual emissions by 18%."` :
                      `"Home energy is your biggest impact at ${((latestRecord.breakdown.homeEnergy / latestRecord.totalEmissions) * 100).toFixed(0)}%. Installing a smart thermostat and improving insulation could save you up to 300kg of CO2 per year."`
                    }
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Top Recommendation</h4>
                    <p className="text-sm">Switch to renewable energy provider for your home.</p>
                    <Badge className="bg-primary/20 text-primary hover:bg-primary/20">High Impact</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="glass-card border-none text-center py-20">
              <CardContent className="space-y-4">
                <Sparkles className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
                <p className="text-muted-foreground">Complete your first calculation to unlock personalized analysis.</p>
                <Button asChild variant="outline" className="border-primary/50 hover:bg-primary/5">
                  <a href="/calculator">Start Calculating</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
