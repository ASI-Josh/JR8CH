'use client';

import React, { useState, useEffect } from 'react';
import { Badge, Dot } from '../ui';
import { ORDERS } from '../../lib/mission-data';

const VPS_API = process.env.NEXT_PUBLIC_VPS_ENDPOINT || 'https://ops.jr8ch.com';
const API_KEY = process.env.NEXT_PUBLIC_VIGIL_API_KEY || '';

interface LiveStrategy {
  filename: string;
  sections: string[];
  orderCount: number;
  orders: Array<{ id: number; text: string }>;
}

function orderColor(status: string) {
  switch (status) {
    case 'ACTIVE': return '#3b82f6';
    case 'PENDING': return '#f59e0b';
    case 'SUPERSEDED': return '#64748b';
    default: return '#10b981';
  }
}

function orderBadgeLevel(status: string) {
  switch (status) {
    case 'ACTIVE': return 'AMBER';
    case 'PENDING': return 'YELLOW';
    case 'SUPERSEDED': return 'MEDIUM';
    default: return 'GREEN';
  }
}

export default function OrdersTab() {
  const [liveStrategies, setLiveStrategies] = useState<LiveStrategy[]>([]);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!API_KEY) return;
    async function fetchStrategy() {
      try {
        const res = await fetch(`${VPS_API}/api/mission/strategy?limit=10`, {
          headers: { 'x-api-key': API_KEY },
        });
        if (!res.ok) throw new Error(`${res.status}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setLiveStrategies(data);
          setIsLive(true);
        }
      } catch {
        // Fall back to static
      }
    }
    fetchStrategy();
    const interval = setInterval(fetchStrategy, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isLive && liveStrategies.length > 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 px-1">
          <Dot color="#10b981" pulse />
          <span className="font-mono text-[10px] tracking-wider text-green-500">LIVE — {liveStrategies.length} STRATEGY BRIEFINGS FROM VPS</span>
        </div>

        {liveStrategies.map((s, i) => (
          <div key={i} className="animate-fadeIn bg-[#1a2235] border border-[#2a3550] rounded-lg overflow-hidden" style={{ borderLeft: '3px solid #3b82f6' }}>
            {/* Header */}
            <div className="flex items-center justify-between p-3 px-4 bg-[#111827] border-b border-[#2a3550]">
              <div className="flex items-center gap-2">
                <span className="text-sm">&#x1F4CB;</span>
                <span className="text-[13px] font-semibold text-slate-200">{s.filename}</span>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">{s.orderCount} ORDERS</span>
            </div>

            {/* Sections */}
            <div className="p-3 px-4">
              <div className="text-[10px] font-semibold text-slate-500 uppercase mb-2">Briefing Sections</div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {s.sections.map((sec, j) => (
                  <span key={j} className="text-[10px] text-slate-400 py-0.5 px-2 rounded bg-white/[.03] border border-white/[.06]">
                    {sec}
                  </span>
                ))}
              </div>

              {/* Orders */}
              {s.orders.length > 0 && (
                <>
                  <div className="text-[10px] font-semibold text-slate-500 uppercase mb-2">Active Orders</div>
                  {s.orders.map((order, j) => (
                    <div key={j} className="flex items-start gap-2.5 p-2.5 mb-1.5 rounded-lg bg-orange-500/[.04] border border-orange-500/[.12]">
                      <span className="font-mono text-sm font-bold text-orange-400 shrink-0">#{order.id}</span>
                      <span className="text-[12px] text-slate-300 leading-snug">{order.text}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Static fallback
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 px-1">
        <Dot color="#f59e0b" />
        <span className="font-mono text-[10px] tracking-wider text-amber-500">STATIC FALLBACK — VPS UNREACHABLE</span>
      </div>

      {[...ORDERS].reverse().map((o, i) => (
        <div
          key={i}
          className="animate-fadeIn flex items-start gap-3.5 p-3 px-3.5 bg-[#1a2235] border border-[#2a3550] rounded-lg"
          style={{ borderLeft: `3px solid ${orderColor(o.status)}` }}
        >
          <div className="font-mono text-[9px] text-slate-500 min-w-[30px]">#{o.id}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-medium">{o.title}</span>
              <Badge level={orderBadgeLevel(o.status)} small />
            </div>
            <div className="text-[11px] text-slate-400 leading-snug">{o.summary}</div>
          </div>
          <div className="font-mono text-[9px] text-slate-500 flex-shrink-0 whitespace-nowrap">{o.date}</div>
        </div>
      ))}
    </div>
  );
}
