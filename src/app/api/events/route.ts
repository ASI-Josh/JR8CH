import { tourDates } from '@/lib/data';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { adminDb } from '@/lib/firebase/admin';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const snapshot = await adminDb()
      .collection(COLLECTIONS.events)
      .where('published', '==', true)
      .orderBy('date', 'asc')
      .get();

    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (events.length) {
      return NextResponse.json(events);
    }
  } catch (error) {
    console.error('Failed to load events from Firestore.', error);
  }

  return NextResponse.json(tourDates);
}
