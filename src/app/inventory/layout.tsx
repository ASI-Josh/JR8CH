import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inventory Management System',
  robots: { index: false, follow: false },
};

export default function InventoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[9999] min-h-screen text-gray-900 overflow-auto" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Background color layer */}
      <div className="fixed inset-0 bg-[#fafbfc]" style={{ zIndex: 0 }} />
      {/* Image layer on top of bg color */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'url(/images/artist/AM2.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.15,
        zIndex: 1,
      }} />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      {/* Content above both layers */}
      <div className="relative" style={{ zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
}
