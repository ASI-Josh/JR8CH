import { campaignTimeline } from '@/lib/data';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { adminDb } from '@/lib/firebase/admin';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const snapshot = await adminDb()
      .collection(COLLECTIONS.campaigns)
      .where('published', '==', true)
      .orderBy('date', 'desc')
      .get();

    const campaigns = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (campaigns.length) {
      return NextResponse.json(campaigns);
    }
  } catch (error) {
    console.error('Failed to load campaigns from Firestore.', error);
  }

  return NextResponse.json(campaignTimeline);
}
