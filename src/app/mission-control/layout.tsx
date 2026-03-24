import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mission Control — The Clarion Agency',
  robots: { index: false, follow: false },
};

export default function MissionControlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[9999] min-h-screen bg-[#060a12] text-slate-200 overflow-auto" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      {children}
    </div>
  );
}
