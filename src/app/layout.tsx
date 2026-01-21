import type { Metadata } from 'next';
import { AnalyticsProvider } from '@/components/analytics-provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { AiChat } from '@/components/ai-chat';
import './globals.css';

export const metadata: Metadata = {
  title: 'JR8CH Hub',
  description: 'The official hub for music artist JR8CH.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background">
        <AnalyticsProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <AiChat />
          <Toaster />
        </AnalyticsProvider>
      </body>
    </html>
  );
}
