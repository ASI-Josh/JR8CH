'use client';

import React from 'react';
import { Badge } from '../ui';
import { ORDERS } from '../../lib/mission-data';

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
  return (
    <div className="flex flex-col gap-3">
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
