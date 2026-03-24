import { products } from '@/lib/data';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { adminDb } from '@/lib/firebase/admin';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const snapshot = await adminDb()
      .collection(COLLECTIONS.products)
      .where('published', '==', true)
      .orderBy('title', 'asc')
      .get();

    const productList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (productList.length) {
      return NextResponse.json(productList);
    }
  } catch (error) {
    console.error('Failed to load products from Firestore.', error);
  }

  return NextResponse.json(products);
}
