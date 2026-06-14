import type { Metadata, Viewport } from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui';
import { GlobalNavigation } from '@/components/layout';
import { Space_Grotesk, Inter } from 'next/font/google';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#10b981',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'EcoPulse AI | Premium Carbon Analytics',
  description:
    'High-performance carbon footprint tracking and AI-driven sustainability strategies.',
  keywords: ['sustainability', 'carbon footprint', 'AI advisor', 'green points', 'eco-friendly'],
  authors: [{ name: 'EcoPulse AI Team' }],
  openGraph: {
    title: 'EcoPulse AI - Environmental Strategy',
    description: 'Track and reduce your carbon footprint with AI.',
    type: 'website',
  },
};

/**
 * Root layout — fonts, providers, skip link, and ARIA live regions.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="font-body text-foreground min-h-screen relative overflow-x-hidden selection:bg-primary/30">

        {/* Skip link — invisible until keyboard focused */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {/* Announces AI streaming responses to screen readers */}
        <div
          id="ai-response-live-region"
          role="status"
          aria-live="polite"
          aria-atomic="false"
          className="sr-only"
        />

        {/* Announces errors and alerts to screen readers */}
        <div
          id="error-live-region"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          className="sr-only"
        />

        <FirebaseClientProvider>
          <ErrorBoundary>
            <GlobalNavigation>
              {children}
            </GlobalNavigation>
          </ErrorBoundary>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
