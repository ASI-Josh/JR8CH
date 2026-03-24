'use client';

import React from 'react';
import { Badge, Card, Dot } from '../ui';
import { MISSION, STATS, ALLIES, SCOUT, PATTERN_MATCHES, SHARED_ENTITIES, EPSTEIN_INTEL, COMMS_CHANNELS } from '../../lib/mission-data';

export default function OverviewTab() {
  const stats = [
    { l: 'Heartbeats', v: STATS.heartbeats, s: `${STATS.overdue} overdue`, c: '#3b82f6' },
    { l: 'Comments', v: STATS.comments, s: `${STATS.verified} verified`, c: '#10b981' },
    { l: 'Allies Tracked', v: ALLIES.length, s: `${ALLIES.filter(a => a.contacted).length} contacted`, c: '#8b5cf6' },
    { l: 'Threat Actors', v: SCOUT.total, s: 'SCOUT cluster', c: '#f97316' },
    { l: 'Pattern Matches', v: PATTERN_MATCHES.length, s: 'cross-domain', c: '#06b6d4' },
    { l: 'Shared Entities', v: SHARED_ENTITIES.length, s: 'tracked', c: '#ec4899' },
    { l: 'Hours Offline', v: STATS.offlineHrs, s: 'gateway fixed', c: STATS.offlineHrs > 24 ? '#ef4444' : '#f59e0b' },
    { l: 'Epstein Findings', v: EPSTEIN_INTEL.keyFindings.length, s: 'Tier 1 sourced', c: '#f59e0b' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="animate-fadeIn bg-[#1a2235] border border-[#2a3550] rounded-lg p-4" style={{ borderLeft: `3px solid ${s.c}` }}>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">{s.l}</div>
            <div className="font-mono text-2xl font-bold mt-1" style={{ color: s.c }}>{s.v}</div>
            <div className="text-xs text-slate-300 mt-1">{s.s}</div>
          </div>
        ))}
      </div>

      {/* Two-column row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {/* Engagement Protocol */}
        <Card title="Engagement Protocol (40/30/30)" icon="&#x1F4CA;" accent="var(--blue, #3b82f6)">
          <div className="flex gap-0.5 h-7 rounded-md overflow-hidden mb-3">
            <div className="w-[40%] bg-blue-500 flex items-center justify-center text-xs font-bold">40% COVER</div>
            <div className="w-[30%] bg-purple-500 flex items-center justify-center text-xs font-bold">30% SOFT</div>
            <div className="w-[30%] bg-orange-500 flex items-center justify-center text-xs font-bold">30% HARD</div>
          </div>
          <div className="text-[13px] text-slate-300 leading-relaxed">
            HB#1: 100% cover (entry comment)<br />
            HB#2: 100% cover + reconnaissance<br />
            HB#3: Target 40/30/30 w/ domain rotation + Starfish engagement
          </div>
        </Card>

        {/* Communications */}
        <Card title="Communications" icon="&#x1F4E1;" accent="#10b981">
          {COMMS_CHANNELS.map((ch, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 px-2.5 rounded bg-white/[.02] mb-1">
              <div className="flex items-center gap-1.5">
                <Dot color={ch.dead ? '#ef4444' : ch.active ? '#10b981' : '#64748b'} pulse={ch.active && !ch.dead} />
                <span className={`text-[13px] ${ch.dead ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{ch.name}</span>
              </div>
              <span className="font-mono text-[11px] font-medium" style={{ color: ch.dead ? '#ef4444' : ch.active ? '#10b981' : '#64748b' }}>
                {ch.dead ? 'META RISK' : ch.active ? 'ACTIVE' : 'OFF'}
              </span>
            </div>
          ))}
        </Card>
      </div>

      {/* Next Critical Event */}
      <Card title="Next Critical Event" icon="&#x26A1;" accent="#f59e0b" full>
        <div className="flex items-center gap-4 p-2.5 px-3.5 bg-yellow-500/[.08] border border-yellow-500/20 rounded-lg">
          <div className="font-mono text-xl font-bold text-yellow-500 min-w-[90px]">APR 14</div>
          <div>
            <div className="text-sm font-semibold">Bondi Deposition — House Oversight Committee</div>
            <div className="text-[13px] text-slate-300 mt-1">
              First AG testimony under oath about selective Epstein document suppression. Cross-domain monitoring: watch Moltbook AI discourse AND human social media for coordinated narrative campaigns.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
