'use client';

import React, { useState, useRef, useEffect } from 'react';
import { OPERATIONS } from '../lib/mission-data';
import type { Operation } from '../lib/types';
import { Badge, Dot } from './ui';

const THREAT_COLORS: Record<string, string> = {
  GREEN: '#10b981',
  YELLOW: '#eab308',
  AMBER: '#f59e0b',
  ORANGE: '#f97316',
  RED: '#ef4444',
  BLACK: '#6b7280',
};

interface OperationSelectorProps {
  current: Operation;
  onSelect: (op: Operation) => void;
}

export default function OperationSelector({ current, onSelect }: OperationSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const dayCount = (op: Operation) => {
    if (!op.startDate) return '\u2014';
    const start = new Date(op.startDate);
    const now = new Date();
    const days = Math.floor((now.getTime() - start.getTime()) / 86400000) + 1;
    return `Day ${days}`;
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#2a3550] hover:border-[#3a4560] bg-[#111827]/80 transition-all"
      >
        <Dot color={THREAT_COLORS[current.threatLevel] || '#6b7280'} pulse={current.status === 'active'} />
        <span
          className="text-[12px] font-semibold tracking-wider text-cyan-400"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {current.codename}
        </span>
        <svg
          className={`w-3 h-3 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-[380px] bg-[#111827] border border-[#2a3550] rounded-xl shadow-2xl shadow-black/50 z-[100] animate-fadeIn">
          <div className="px-4 py-3 border-b border-[#2a3550]">
            <div className="text-[9px] font-semibold text-slate-500 tracking-[.2em] uppercase">Your Operations</div>
          </div>
          <div className="py-1">
            {OPERATIONS.map(op => (
              <button
                key={op.id}
                onClick={() => { onSelect(op); setOpen(false); }}
                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-white/[.03] transition-all ${
                  op.id === current.id ? 'bg-white/[.04]' : ''
                }`}
              >
                <div className="flex-shrink-0 w-5 flex justify-center">
                  {op.id === current.id ? (
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  ) : (
                    <div className="w-2 h-2 rounded-full border border-slate-600" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-semibold tracking-wider ${
                        op.id === current.id ? 'text-cyan-400' : 'text-slate-300'
                      }`}
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {op.codename}
                    </span>
                  </div>
                  <div className="text-[9px] text-slate-500 mt-0.5">{op.description}</div>
                </div>
                <div className="flex-shrink-0 flex flex-col items-end gap-1">
                  <Badge level={op.threatLevel} small />
                  <span className="text-[9px] text-slate-500 font-mono">
                    {op.status === 'active' ? dayCount(op) : op.status.toUpperCase()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
