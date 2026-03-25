import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inventory Tracker',
  robots: { index: false, follow: false },
};

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      {children}
    </div>
  );
}
