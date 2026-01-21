'use client';
import Link from 'next/link';
import { Menu, Music, Clapperboard, Calendar, Rss, HomeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/music', label: 'Music', icon: Music },
  { href: '/visuals', label: 'Visuals', icon: Clapperboard },
  { href: '/campaigns', label: 'Campaigns', icon: Calendar },
  { href: '/events', label: 'Events', icon: Rss },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold font-headline text-lg tracking-wider text-primary">JR8CH Hub</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {navLinks.slice(1).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="md:hidden flex-1">
           <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
                <Link href="/" className="flex items-center space-x-2 p-4 border-b">
                  <span className="font-bold font-headline text-lg tracking-wider text-primary">JR8CH Hub</span>
                </Link>
                <div className="space-y-4 py-4">
                  <div className="px-3 py-2">
                    <div className="space-y-1">
                       {navLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center rounded-lg px-3 py-2 text-foreground hover:bg-accent hover:text-accent-foreground"
                          >
                            <link.icon className="mr-2 h-4 w-4" />
                            <span>{link.label}</span>
                          </Link>
                        ))}
                    </div>
                  </div>
                </div>
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Link href="/" className="flex items-center space-x-2 md:hidden">
            <span className="font-bold font-headline text-lg tracking-wider text-primary">JR8CH Hub</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
