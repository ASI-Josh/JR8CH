export type Release = {
  id: string;
  title: string;
  artist: string;
  year: number;
  genre: string;
  artwork?: string;
  artworkUrl?: string;
  streamUrl: string;
  purchaseUrl: string;
};

export type YoutubeVisual = {
  id: string;
  title: string;
  videoId: string;
};

export type CampaignEvent = {
  id: string;
  date: string;
  title: string;
  description: string;
};

export type TourDate = {
  id: string;
  date: string;
  city: string;
  venue: string;
  status: 'Tickets' | 'Sold Out';
  ticketUrl: string;
};

export type Product = {
  id: string;
  title: string;
  type: 'music' | 'merch' | 'ticket' | 'bundle';
  price: number;
  currency: 'AUD';
  description: string;
  image: string;
  purchaseUrl: string;
};

export const musicReleases: Release[] = [
  { id: '1', title: 'Kinetic Pulse', artist: 'JR8CH', year: 2024, genre: 'Drum & Bass', artwork: '1', streamUrl: '#', purchaseUrl: '#' },
  { id: '2', title: 'Future Shock EP', artist: 'JR8CH', year: 2023, genre: 'Neurofunk', artwork: '2', streamUrl: '#', purchaseUrl: '#' },
  { id: '3', title: 'Chrome Echoes', artist: 'JR8CH', year: 2023, genre: 'Liquid DnB', artwork: '3', streamUrl: '#', purchaseUrl: '#' },
  { id: '4', title: 'Grid Runner', artist: 'JR8CH', year: 2022, genre: 'Cyberpunk', artwork: '4', streamUrl: '#', purchaseUrl: '#' },
  { id: '5', title: 'Sub-Zero', artist: 'JR8CH', year: 2021, genre: 'Minimal DnB', artwork: '5', streamUrl: '#', purchaseUrl: '#' },
];

export const youtubeVisuals: YoutubeVisual[] = [
  { id: '1', title: 'Kinetic Pulse - Official Visualizer', videoId: 'dQw4w9WgXcQ' },
  { id: '2', title: 'Future Shock - Live Performance Visuals', videoId: 'dQw4w9WgXcQ' },
  { id: '3', title: 'Chrome Echoes - AI Generated Video', videoId: 'dQw4w9WgXcQ' },
  { id: '4', title: 'Grid Runner - Animated Short', videoId: 'dQw4w9WgXcQ' },
];

export const campaignTimeline: CampaignEvent[] = [
  { id: '1', date: '2024-08-15', title: 'Single Release: "Fractal"', description: 'Mastering complete. Artwork finalized. Distribution scheduled.' },
  { id: '2', date: '2024-09-01', title: 'Music Video Shoot', description: 'Day 1 of shooting for "Fractal" music video.' },
  { id: '3', date: '2024-09-20', title: 'EP Announcement', description: 'Announce the "Quantum" EP on social media.' },
  { id: '4', date: '2024-10-10', title: 'EP Release: "Quantum"', description: 'Full EP available on all platforms.' },
];

export const tourDates: TourDate[] = [
  { id: '1', date: '2024-11-05', city: 'Berlin', venue: 'Berghain', status: 'Tickets', ticketUrl: '#' },
  { id: '2', date: '2024-11-12', city: 'London', venue: 'Fabric', status: 'Tickets', ticketUrl: '#' },
  { id: '3', date: '2024-11-20', city: 'Prague', venue: 'Cross Club', status: 'Sold Out', ticketUrl: '#' },
  { id: '4', date: '2024-12-02', city: 'New York', venue: 'Elsewhere', status: 'Tickets', ticketUrl: '#' },
];

export const products: Product[] = [
  {
    id: '1',
    title: 'Kinetic Pulse (Digital Download)',
    type: 'music',
    price: 14.99,
    currency: 'AUD',
    description: 'High-resolution WAV and MP3 pack with bonus stems.',
    image: '1',
    purchaseUrl: '#',
  },
  {
    id: '2',
    title: 'JR8CH Logo Tee',
    type: 'merch',
    price: 39.0,
    currency: 'AUD',
    description: 'Black cotton tee with front logo print.',
    image: '2',
    purchaseUrl: '#',
  },
  {
    id: '3',
    title: 'JR8CH Poster Pack',
    type: 'merch',
    price: 24.0,
    currency: 'AUD',
    description: 'A2 posters printed on heavyweight matte stock.',
    image: '3',
    purchaseUrl: '#',
  },
];
