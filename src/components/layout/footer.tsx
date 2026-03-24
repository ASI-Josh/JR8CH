import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Github, Twitter, Youtube, Twitch } from 'lucide-react';

const socialLinks = [
  { name: 'GitHub', icon: Github, url: '#' },
  { name: 'Twitter', icon: Twitter, url: '#' },
  { name: 'YouTube', icon: Youtube, url: '#' },
  { name: 'Twitch', icon: Twitch, url: '#' },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background/95">
      <div className="container py-8 grid grid-cols-1 md:grid-cols-3 items-center justify-between gap-8 text-center md:text-left">
        <div>
          <p className="font-headline text-lg font-bold">JR8CH Hub</p>
          <p className="text-sm text-muted-foreground">(c) {new Date().getFullYear()} All rights reserved.</p>
        </div>
        <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
          <p className="font-semibold">Stay updated</p>
          <form className="flex w-full items-center space-x-2">
            <Input type="email" placeholder="Email" className="flex-1" aria-label="Email for newsletter" />
            <Button type="submit" variant="default">Subscribe</Button>
          </form>
        </div>
        <div className="flex items-center justify-center md:justify-end space-x-2">
          {socialLinks.map((social) => (
            <Button key={social.name} variant="ghost" size="icon" asChild>
              <Link href={social.url} aria-label={social.name}>
                <social.icon className="h-5 w-5" />
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </footer>
  );
}
