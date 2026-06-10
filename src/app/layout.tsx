
import type { Metadata } from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'EcoPulse AI - Carbon Footprint Awareness',
  description: 'Track and reduce your carbon footprint with AI-powered insights.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen relative">
        {/* Global Background Image */}
        <div 
          className="fixed inset-0 z-0 pointer-events-none bg-cover bg-center" 
          style={{ backgroundImage: "url('https://picsum.photos/seed/ecopulse-vibrant-bloom/1920/1080')" }}
          data-ai-hint="vibrant lush valley flowers"
        />
        {/* Brightness Overlay */}
        <div className="fixed inset-0 z-0 bg-white/30 pointer-events-none" />
        
        <div className="relative z-10">
          <FirebaseClientProvider>
            {children}
            <Toaster />
          </FirebaseClientProvider>
        </div>
      </body>
    </html>
  );
}
