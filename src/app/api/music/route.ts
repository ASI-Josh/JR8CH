import { musicReleases } from '@/lib/data';
import { NextResponse } from 'next/server';

export async function GET() {
  // In a real app, you would fetch this from a database.
  // The revalidate option can be used to implement ISR-like behavior.
  // e.g., fetch('...', { next: { revalidate: 60 } })
  return NextResponse.json(musicReleases);
}
