
"use client";

import { useState } from 'react';
import { Sparkles, MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export function FloatingAIAdvisor() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Hello! I am your EcoPulse AI Advisor. How can I help you reduce your carbon footprint today?' }
  ]);

  const handleSend = async () => {
    if (!query.trim()) return;
    
    const userMsg = query;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setQuery('');
    setIsLoading(true);

    // AI logic would go here, calling a Genkit flow
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: "I'm analyzing your recent transportation data. Switching to a bike for trips under 5km could save you roughly 12kg of CO2 this month!" 
      }]);
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
                      "p-3 rounded-2xl text-sm",
                      m.role === 'user' 
                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                        : "bg-white/5 border border-white/10 rounded-tl-none"
                    )}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    AI is thinking...
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-3 border-t border-white/5 flex gap-2">
              <Input 
                placeholder="Ask about sustainability..." 
                className="bg-white/5 border-white/10 text-sm h-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button size="icon" className="h-9 w-9" onClick={handleSend} disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button 
          size="lg" 
          className="h-14 w-14 rounded-full bg-primary shadow-lg shadow-primary/20 hover:scale-110 transition-transform"
          onClick={() => setIsOpen(true)}
        >
          <Sparkles className="h-6 w-6 text-primary-foreground" />
        </Button>
      )}
    </div>
  );
}
