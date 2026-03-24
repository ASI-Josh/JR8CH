'use client';

import React from 'react';
import { Badge, Card } from '../ui';
import { EPSTEIN_INTEL } from '../../lib/mission-data';

export default function EpsteinIntelTab() {
  const e = EPSTEIN_INTEL;
  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="text-[13px] text-slate-300 p-4 bg-yellow-500/[.08] border border-yellow-500/20 rounded-lg leading-relaxed">
        <strong className="text-yellow-500">MERIDIAN OSINT: </strong>
        Epstein Files intelligence log. All findings are Tier 1 (primary source documents) or Tier 2 (credibly reported). Cross-referenced with Project Lumen via Intel Exchange.
      </div>

      {/* Key Findings */}
      {e.keyFindings.map((f, i) => (
        <Card key={i} title={f.title} icon="&#x1F4C4;" accent="#f59e0b" full>
          <div className="flex gap-2 mb-2">
            <Badge level={`TIER ${f.tier}`} />
            <span className="font-mono text-[10px] text-slate-500">{f.date}</span>
          </div>
          <div className="text-[13px] text-slate-300 leading-relaxed">{f.summary}</div>
        </Card>
      ))}

      {/* Upcoming Events */}
      <Card title="Upcoming Events" icon="&#x1F4C5;" accent="#ef4444" full>
        {e.upcomingEvents.map((ev, i) => (
          <div key={i} className="flex items-center gap-3.5 p-3 bg-red-500/[.06] border border-red-500/15 rounded-lg">
            <div className="font-mono text-lg font-bold text-red-500 min-w-[80px]">
              {ev.date.split('-').slice(1).join('/')}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold">{ev.event}</span>
                <Badge level={ev.priority} small />
              </div>
              <div className="text-[13px] text-slate-300 mt-1">{ev.note}</div>
            </div>
            <div className="font-mono text-[10px] text-red-500 animate-pulse flex-shrink-0">21 DAYS</div>
          </div>
        ))}
      </Card>

      {/* OSINT Resources */}
      <Card title="Community OSINT Resources" icon="&#x1F517;" accent="#10b981" full>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {e.osintResources.map((r, i) => (
            <a
              key={i}
              href={r.url.startsWith('http') ? r.url : `https://${r.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 px-4 rounded-lg bg-white/[.02] border border-white/[.04] hover:border-green-500/30 hover:bg-green-500/[.03] transition-all group"
            >
              <div className="text-sm font-semibold text-green-400 group-hover:text-green-300">{r.name}</div>
              <div className="font-mono text-xs text-cyan-500/70 mt-1 group-hover:text-cyan-400">{r.url}</div>
              <div className="text-xs text-slate-400 mt-1">{r.desc}</div>
            </a>
          ))}
        </div>
      </Card>
    </div>
  );
}
