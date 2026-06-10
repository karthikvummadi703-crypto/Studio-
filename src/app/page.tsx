
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Leaf, Zap, Globe, ArrowRight, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-white/5 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2" href="/">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="font-headline font-bold text-xl tracking-tighter">EcoPulse AI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Button asChild variant="ghost" className="text-sm font-medium hover:text-primary transition-colors">
             <Link href="/dashboard">Preview Platform</Link>
          </Button>
          <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-primary/10 to-transparent pointer-events-none" />
          <div className="container mx-auto relative z-10">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2 duration-700">
                  <Sparkles className="h-3 w-3" /> AI-Powered Sustainability
                </div>
                <h1 className="text-5xl font-headline font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl/none leading-tight">
                  The Intelligent Way to <br />
                  <span className="text-primary emerald-glow">Track Your Impact</span>
                </h1>
                <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl font-body leading-relaxed">
                  EcoPulse AI uses advanced intelligence to track, analyze, and help you reduce your environmental footprint. Join the future of sustainable living.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg" className="h-14 px-10 bg-primary text-primary-foreground text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                  <Link href="/dashboard">Start Your Journey <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-10 border-primary/20 hover:bg-primary/5 text-lg font-bold">
                  <Link href="/dashboard">Explore Demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-20 bg-secondary/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center p-8 glass-card rounded-3xl border-primary/10 group hover:border-primary/30 transition-all">
                <div className="p-4 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform">
                  <Zap className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-headline font-bold">AI Insights</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Personalized carbon reduction strategies powered by Gemini AI, tailored to your lifestyle.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-8 glass-card rounded-3xl border-primary/10 group hover:border-primary/30 transition-all">
                <div className="p-4 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform">
                  <Globe className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-headline font-bold">Real-time Analytics</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Visual emission trends and weekly progress reports that make complex data simple.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-8 glass-card rounded-3xl border-primary/10 group hover:border-primary/30 transition-all">
                <div className="p-4 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform">
                  <Leaf className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-headline font-bold">Smart Tracking</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Effortless calculation of transportation, energy, and lifestyle impact with guided workflows.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full py-8 border-t border-white/5 px-4 md:px-6">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-primary" />
            <p className="text-sm font-bold">EcoPulse AI</p>
          </div>
          <p className="text-xs text-muted-foreground">© 2024 EcoPulse AI. All rights reserved.</p>
          <nav className="flex gap-6">
            <Link className="text-xs hover:text-primary transition-colors text-muted-foreground" href="#">Terms of Service</Link>
            <Link className="text-xs hover:text-primary transition-colors text-muted-foreground" href="#">Privacy Policy</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
