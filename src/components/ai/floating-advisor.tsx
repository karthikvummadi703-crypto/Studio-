"use client";

import { useState, useMemo } from 'react';
import { Sparkles, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser, useFirestore, useDoc, useCollection } from '@/firebase';
import { doc, collection, query, orderBy, limit } from 'firebase/firestore';
import { cn } from '@/lib/utils';

export function FloatingAIAdvisor() {
  const { user } = useUser();
  const db = useFirestore();
  const { data: profile } = useDoc(user ? doc(db!, 'users', user.uid) : null);
  
  const recordsQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, 'calculator_records'), orderBy('timestamp', 'desc'), limit(1));
  }, [db, user]);
  const { data: latestRecords } = useCollection(recordsQuery);
  const latestRecord = latestRecords?.[0];

  const [isOpen, setIsOpen] = useState(false);
  const [queryInput, setQueryInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Hello! I am your EcoPulse AI Advisor. I use your real sustainability data to provide expert guidance. How can I help you today?' }
  ]);

  const handleSend = async () => {
    if (!queryInput.trim()) return;
    
    const userMsg = queryInput;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setQueryInput('');
    setIsLoading(true);

    // AI Context building
    const context = `User Score: ${profile?.sustainabilityScore || 0}, Points: ${profile?.greenPoints || 0}, Last Emission: ${latestRecord?.totalEmissions || 'N/A'} kgCO2e.`;
    
    // Simulate AI reasoning based on user data
    setTimeout(() => {
      let aiResponse = "I'm analyzing your sustainability metrics. ";
      if (latestRecord) {
        if (latestRecord.breakdown.transportation > 50) {
          aiResponse += "I see your transportation impact is significant. Switching to a bicycle for short trips could save you roughly 15kg of CO2 per month!";
        } else {
          aiResponse += "Great job keeping your transportation emissions low! Focus on reducing home energy usage to boost your score further.";
        }
      } else {
        aiResponse += "I don't have enough data yet. Complete a carbon footprint calculation so I can give you personalized reduction strategies.";
      }

      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <Card className="w-80 md:w-96 shadow-2xl border-primary/20 glass-card animate-in slide-in-from-bottom-4 duration-300">
          <CardHeader className="flex flex-row items-center justify-between py-3 border-b border-white/5">
            <CardTitle className="text-sm font-headline flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Advisor
            </CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex flex-col h-[400px]">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((m, i) => (
                  <div key={i} className={cn(
                    "flex flex-col max-w-[85%]",
                    m.role === 'user' ? "ml-auto items-end" : "items-start"
                  )}>
                    <div className={cn(
                      "p-3 rounded-2xl text-sm leading-relaxed",
                      m.role === 'user' 
                        ? "bg-primary text-primary-foreground rounded-tr-none shadow-md" 
                        : "bg-white/5 border border-white/10 rounded-tl-none"
                    )}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground animate-pulse font-bold uppercase tracking-widest">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Analyzing your Eco-Data...
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-3 border-t border-white/5 flex gap-2 bg-background/50">
              <Input 
                placeholder="Ask about your footprint..." 
                className="bg-white/5 border-white/10 text-sm h-9"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button size="icon" className="h-9 w-9 bg-primary" onClick={handleSend} disabled={isLoading}>
                <Send className="h-4 w-4 text-primary-foreground" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button 
          size="lg" 
          className="h-14 w-14 rounded-full bg-primary shadow-lg shadow-primary/20 hover:scale-110 transition-transform group"
          onClick={() => setIsOpen(true)}
        >
          <Sparkles className="h-6 w-6 text-primary-foreground group-hover:rotate-12 transition-transform" />
        </Button>
      )}
    </div>
  );
}
