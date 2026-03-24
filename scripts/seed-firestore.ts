import dotenv from 'dotenv';
import { adminDb } from '../src/lib/firebase/admin';
import { campaignTimeline, musicReleases, products, tourDates, youtubeVisuals } from '../src/lib/data';
import { PlaceHolderImages } from '../src/lib/placeholder-images';

dotenv.config({ path: '.env.local' });

const imageMap = new Map(PlaceHolderImages.map((image) => [image.id, image.imageUrl]));

const withMeta = <T extends Record<string, unknown>>(data: T) => {
  const now = new Date().toISOString();
  return {
    ...data,
    published: true,
    createdAt: now,
    updatedAt: now,
  };
};

const writeCollection = async <T extends { id: string }>(
  collection: string,
  items: T[],
  mapper: (item: T) => Record<string, unknown>
) => {
  const db = adminDb();
  const batch = db.batch();

  items.forEach((item) => {
    const docRef = db.collection(collection).doc(item.id);
    batch.set(docRef, mapper(item), { merge: true });
  });

  await batch.commit();
};

const seed = async () => {
  await writeCollection('releases', musicReleases, (release) =>
    withMeta({
      ...release,
      artworkUrl: imageMap.get(release.artwork) ?? null,
    })
  );

  await writeCollection('visuals', youtubeVisuals, (visual) =>
    withMeta({
      ...visual,
    })
  );

  await writeCollection('campaigns', campaignTimeline, (campaign) =>
    withMeta({
      ...campaign,
    })
  );

  await writeCollection('events', tourDates, (event) =>
    withMeta({
      ...event,
    })
  );

  await writeCollection('products', products, (product) =>
    withMeta({
      ...product,
      imageUrl: imageMap.get(product.image) ?? null,
    })
  );
};

seed()
  .then(() => {
    console.log('Firestore seed complete.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Firestore seed failed:', error);
    process.exit(1);
  });
