import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inventory Management System',
  robots: { index: false, follow: false },
};

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[9999] min-h-screen bg-[#fafbfc] text-gray-900 overflow-auto" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        backgroundImage: 'url(/images/artist/AM.jpeg)',
        backgroundSize: '350px',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.03,
        filter: 'grayscale(100%)',
      }} />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      {children}
    </div>
  );
}
