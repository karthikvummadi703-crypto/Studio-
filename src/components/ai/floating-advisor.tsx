
"use client";

import { useState, useMemo } from 'react';
import { Sparkles, X, Send, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { cn } from '@/lib/utils';

export function FloatingAIAdvisor() {
  const { user } = useUser();
  const db = useFirestore();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Hello! I am your EcoPulse Advisor. I can analyze your sustainability habits and suggest ways to reduce your footprint. What would you like to know?' }
  ]);

  const recordsQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, 'calculator_records'), orderBy('timestamp', 'desc'), limit(1));
  }, [db, user]);
  const { data: latestRecords } = useCollection(recordsQuery);
  const latestRecord = latestRecords?.[0];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    // Simulate contextual intelligence for demo purposes
    setTimeout(() => {
      let response = "That's a great question. ";
      if (!latestRecord) {
        response += "Once you complete your first carbon calculation, I can give you hyper-personalized advice. Generally, switching to LED bulbs and reducing beef consumption are the fastest ways to lower your footprint by up to 15%.";
      } else {
        const highest = Object.entries(latestRecord.breakdown).reduce((a, b) => (a[1] as number) > (b[1] as number) ? a : b);
        response += `Based on your recent data, your ${highest[0]} usage is the most significant factor. By optimizing this area, you could potentially reach 'Eco Warrior' level within the next 3 weeks.`;
      }

      setMessages(prev => [...prev, { role: 'ai', text: response }]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className={cn(
      "fixed bottom-6 right-6 z-50 transition-all duration-300",
      isOpen ? "w-[350px]" : "w-14"
    )}>
      {isOpen ? (
        <Card className={cn(
          "shadow-2xl border-primary/20 glass-card flex flex-col transition-all duration-300",
          isExpanded ? "h-[600px]" : "h-[450px]"
        )}>
          <CardHeader className="flex flex-row items-center justify-between py-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-headline">AI Advisor</CardTitle>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((m, i) => (
                  <div key={i} className={cn(
                    "flex flex-col max-w-[85%] animate-in fade-in slide-in-from-bottom-2",
                    m.role === 'user' ? "ml-auto items-end" : "items-start"
                  )}>
                    <div className={cn(
                      "p-3 rounded-2xl text-xs leading-relaxed shadow-sm",
                      m.role === 'user' 
                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                        : "bg-white/5 border border-white/10 rounded-tl-none"
                    )}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold tracking-widest animate-pulse px-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Analyzing footprint...
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-3 border-t border-white/5 bg-background/50 flex gap-2">
              <Input 
                placeholder="Ask your advisor..." 
                className="bg-white/5 border-white/10 text-xs h-9 focus-visible:ring-primary/30"
                value={input}
                onChange={(e) => setInput(e.target.value)}
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
          className="h-14 w-14 rounded-full bg-primary shadow-lg shadow-primary/40 hover:scale-110 transition-transform flex items-center justify-center p-0 ring-4 ring-primary/20"
          onClick={() => setIsOpen(true)}
        >
          <Sparkles className="h-6 w-6 text-primary-foreground" />
        </Button>
      )}
    </div>
  );
}
