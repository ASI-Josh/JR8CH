import { youtubeVisuals } from '@/lib/data';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { adminDb } from '@/lib/firebase/admin';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const snapshot = await adminDb()
      .collection(COLLECTIONS.visuals)
      .where('published', '==', true)
      .get();

    const visuals = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (visuals.length) {
      return NextResponse.json(visuals);
    }
  } catch (error) {
    console.error('Failed to load visuals from Firestore.', error);
  }

  return NextResponse.json(youtubeVisuals);
}
