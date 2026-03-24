'use client'

import { useState, useEffect, useMemo } from 'react';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Release } from '@/lib/data';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlayCircle, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

const imageMap = new Map<string, ImagePlaceholder>(PlaceHolderImages.map(img => [img.id, img]));

function MusicCard({ release }: { release: Release }) {
  const artwork = release.artwork ? imageMap.get(release.artwork) : undefined;
  const imageUrl = release.artworkUrl ?? artwork?.imageUrl;
  const imageHint = artwork?.imageHint;
  const imageAlt = artwork?.description ?? `${release.title} artwork`;

  return (
    <Card className="flex flex-col overflow-hidden border-border/60 hover:border-primary/80 transition-all duration-300 group bg-card">
      <CardHeader className="p-0">
        {imageUrl && (
          <div className="aspect-square relative">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              data-ai-hint={imageHint}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-xl tracking-wide">{release.title}</CardTitle>
        <div className="flex items-center gap-2 mt-2">
           <Badge variant="secondary">{release.year}</Badge>
           <Badge variant="outline">{release.genre}</Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex gap-2">
        <Button asChild variant="default" className="w-full">
          <Link href={release.streamUrl}><PlayCircle className="mr-2 h-4 w-4" /> Stream</Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href={release.purchaseUrl}><ShoppingCart className="mr-2 h-4 w-4" /> Buy</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function MusicCardSkeleton() {
    return (
        <Card>
            <Skeleton className="aspect-square" />
            <CardContent className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardContent>
            <CardFooter className="p-4 flex gap-2">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
            </CardFooter>
        </Card>
    )
}

export default function MusicPage() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const res = await fetch('/api/music');
        const data = await res.json();
        setReleases(data);
      } catch (error) {
        console.error('Failed to fetch music releases', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReleases();
  }, []);

  const filteredReleases = useMemo(() => {
    return releases.filter(release =>
      release.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      release.genre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [releases, searchTerm]);
  
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-wider">Music Archive</h1>
        <p className="mt-2 text-lg text-muted-foreground">Explore the discography.</p>
      </div>
      
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <Input 
          placeholder="Search by title or genre..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => <MusicCardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredReleases.map(release => (
            <MusicCard key={release.id} release={release} />
          ))}
        </div>
      )}
    </div>
  );
}
