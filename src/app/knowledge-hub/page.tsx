
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Sparkles, TrendingDown, Lightbulb, Globe, Leaf } from 'lucide-react';
import { useUser, useCollection } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useMemo } from 'react';

const EDUCATIONAL_TOPICS = [
  {
    title: "Carbon Footprint Basics",
    desc: "Understand what a carbon footprint is and why tracking it matters for the planet.",
    icon: Globe,
    category: "Essentials"
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
  }
];

export default function KnowledgeHubPage() {
  const { user } = useUser();
  const db = useFirestore();

  const recordsQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'calculator_records'),
      orderBy('timestamp', 'desc'),
      limit(1)
    );
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
              <Card key={i} className="glass-card border-none hover:bg-white/10 transition-colors">
                <CardHeader>
                  <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4">
                    <topic.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="outline" className="w-fit text-[10px] uppercase mb-2">{topic.category}</Badge>
                  <CardTitle className="font-headline">{topic.title}</CardTitle>
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
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Based on your last calculation of <span className="text-primary font-bold">{latestRecord.totalEmissions.toFixed(1)} kgCO2e</span>:
                  </p>
                  <div className="space-y-3">
                    {Object.entries(latestRecord.breakdown).map(([key, val]: [string, any]) => (
                      <div key={key} className="flex justify-between items-center text-sm">
                        <span className="capitalize">{key}</span>
                        <span className="font-mono">{((val / latestRecord.totalEmissions) * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-none">
                <CardHeader>
                  <CardTitle className="font-headline flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    AI Suggestion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 italic text-sm">
                    "Your transportation sector accounts for {((latestRecord.breakdown.transportation / latestRecord.totalEmissions) * 100).toFixed(0)}% of your footprint. Switching to public transport just twice a week could reduce your overall annual emissions by 18%."
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="glass-card border-none text-center py-20">
              <CardContent className="space-y-4">
                <Sparkles className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
                <p className="text-muted-foreground">Complete your first calculation to see personalized insights.</p>
                <Button asChild variant="outline">
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
