'use client';

import React from 'react';

interface CardProps {
  title: string;
  icon?: string;
  accent?: string;
  full?: boolean;
  children: React.ReactNode;
}

export default function Card({ title, icon, accent, full, children }: CardProps) {
  return (
    <div
      className="animate-fadeIn bg-[#1a2235] border border-[#2a3550] rounded-xl p-5"
      style={{
        gridColumn: full ? '1 / -1' : undefined,
        borderTop: accent ? `2px solid ${accent}` : undefined,
      }}
    >
      <div className="flex items-center gap-2 mb-3.5">
        {icon && <span className="text-[15px]">{icon}</span>}
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</h3>
      </div>
      {children}
    </div>
  );
}
