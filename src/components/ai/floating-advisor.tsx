
"use client";

import { useState } from 'react';
import { Sparkles, X, Send, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export function FloatingAIAdvisor() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Hello! I am your EcoPulse Advisor. I can analyze your sustainability habits and suggest ways to reduce your footprint. What would you like to know?' }
  ]);

  const handleSend = async (customMsg?: string) => {
    const text = customMsg || input;
    if (!text.trim() || isLoading) return;
    
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: "I've analyzed your request against current ecological standards. Your next best action is to complete an Impact Audit to provide the telemetry data needed for a full analysis." 
      }]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Bottom Bar (Trigger) */}
      <div className="fixed bottom-0 left-64 right-0 h-16 bg-black/40 backdrop-blur-xl border-t border-white/5 flex items-center justify-between px-10 z-40">
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setIsOpen(true)}>
           <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/40 transition-colors">
              <Sparkles className="h-5 w-5 text-primary" />
           </div>
           <div>
              <p className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase">EcoPulse AI Advisor</p>
              <p className="text-[11px] font-bold text-white/60">How can I help you reduce your footprint today?</p>
           </div>
        </div>

        <div className="flex gap-4">
           {['Analyze My Footprint', 'Reduce Emissions', 'Next Action'].map(prompt => (
              <Button 
                key={prompt}
                variant="outline" 
                size="sm" 
                className="hidden lg:flex h-9 px-4 border-white/5 bg-white/5 text-[9px] font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all rounded-full"
                onClick={() => {
                  setIsOpen(true);
                  handleSend(prompt);
                }}
              >
                {prompt}
              </Button>
           ))}
        </div>
      </div>

      {/* Main Drawer */}
      <div className={cn(
        "fixed bottom-20 right-8 z-50 transition-all duration-500 ease-in-out transform",
        isOpen ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95 pointer-events-none",
        isExpanded ? "w-[500px]" : "w-[380px]"
      )}>
        <Card className={cn(
          "shadow-2xl border-primary/20 glass-card flex flex-col transition-all duration-300 rounded-[2rem] overflow-hidden",
          isExpanded ? "h-[700px]" : "h-[500px]"
        )}>
          <CardHeader className="flex flex-row items-center justify-between py-5 px-6 border-b border-white/5 bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <CardTitle className="text-sm font-headline font-bold uppercase tracking-widest">AI Advisor</CardTitle>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {messages.map((m, i) => (
                  <div key={i} className={cn(
                    "flex flex-col max-w-[90%] animate-in fade-in slide-in-from-bottom-2",
                    m.role === 'user' ? "ml-auto items-end" : "items-start"
                  )}>
                    <div className={cn(
                      "p-4 rounded-[1.5rem] text-xs leading-relaxed shadow-lg",
                      m.role === 'user' 
                        ? "bg-primary text-primary-foreground rounded-tr-none font-medium" 
                        : "bg-white/5 border border-white/10 rounded-tl-none text-white/80"
                    )}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-3 text-[10px] text-primary uppercase font-bold tracking-widest animate-pulse px-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Synthesizing planetary data...
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-5 border-t border-white/5 bg-black/40 flex gap-3">
              <Input 
                placeholder="Ask your advisor anything..." 
                className="bg-white/5 border-white/10 text-xs h-12 rounded-xl focus-visible:ring-primary/30"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button size="icon" className="h-12 w-12 bg-primary hover:scale-105 transition-transform" onClick={() => handleSend()} disabled={isLoading}>
                <Send className="h-5 w-5 text-primary-foreground" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
