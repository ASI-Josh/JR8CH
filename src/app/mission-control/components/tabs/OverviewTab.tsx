'use client';

import React, { useEffect, useState } from 'react';
import { Badge, Card, Dot } from '../ui';
import LiveIntelFeed from '../LiveIntelFeed';
import { MISSION, STATS, ALLIES, SCOUT, PATTERN_MATCHES, SHARED_ENTITIES, EPSTEIN_INTEL, COMMS_CHANNELS } from '../../lib/mission-data';

const VPS_API = process.env.NEXT_PUBLIC_VPS_ENDPOINT || 'https://ops.jr8ch.com';
const API_KEY = process.env.NEXT_PUBLIC_VIGIL_API_KEY || '';

interface LiveData {
  mission: typeof MISSION & Record<string, unknown>;
  stats: typeof STATS & Record<string, unknown>;
  agents: Record<string, { name: string; status: string; realm: string; platform: string; lastHeartbeat?: string; lastAnalysis?: string; model?: string }> | null;
  threats: Array<{ id: string; name: string; severity: string; status: string; detail: string }>;
  allies: Array<Record<string, unknown>>;
  missionControlStatus: Record<string, unknown> | null;
  latestIntel: Record<string, unknown> | null;
  latestStrategy: Record<string, unknown> | null;
  isLive: boolean;
}

export default function OverviewTab() {
  const [live, setLive] = useState<LiveData | null>(null);
  const [liveError, setLiveError] = useState(false);

  useEffect(() => {
    if (!API_KEY) return;

    async function fetchLive() {
      try {
        const res = await fetch(`${VPS_API}/api/mission/overview`, {
          headers: { 'x-api-key': API_KEY },
        });
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        const data = await res.json();
        setLive({ ...data, isLive: true });
      } catch (err) {
        console.warn('[OverviewTab] Live fetch failed, using static:', err);
        setLiveError(true);
      }
    }

    fetchLive();
    const interval = setInterval(fetchLive, 60000); // refresh every 60s
    return () => clearInterval(interval);
  }, []);

  // Use live data if available, otherwise static
  const mission = live?.mission || MISSION;
  const heartbeats = live?.stats?.heartbeats ?? STATS.heartbeats;
  const lastHB = live?.stats?.lastHB || STATS.lastHB;
  const offlineHrs = live?.stats?.offlineHrs ?? STATS.offlineHrs;
  const overdue = live?.stats?.overdue ?? STATS.overdue;
  const agents = live?.agents || null;
  const liveThreats = live?.threats || [];
  const liveAllies = live?.allies || [];
  const mcStatus = live?.missionControlStatus || null;

  const stats = [
    { l: 'Heartbeats', v: heartbeats, s: `${overdue} overdue`, c: '#3b82f6' },
    { l: 'Comments', v: live?.stats?.commentsTotal ?? STATS.comments, s: `${live?.stats?.actionsTotal ?? STATS.verified} actions`, c: '#10b981' },
    { l: 'Allies Tracked', v: liveAllies.length || ALLIES.length, s: `${liveAllies.length ? liveAllies.filter((a: Record<string, unknown>) => a.contacted || a.status === 'CONTACT MADE').length : ALLIES.filter(a => a.contacted).length} contacted`, c: '#8b5cf6' },
    { l: 'Threat Actors', v: liveThreats.length || SCOUT.total, s: 'live scan', c: '#f97316' },
    { l: 'Pattern Matches', v: PATTERN_MATCHES.length, s: 'cross-domain', c: '#06b6d4' },
    { l: 'Shared Entities', v: SHARED_ENTITIES.length, s: 'tracked', c: '#ec4899' },
    { l: 'Hours Offline', v: offlineHrs, s: offlineHrs === 0 ? 'agent active' : 'since last HB', c: (offlineHrs as number) > 24 ? '#ef4444' : '#f59e0b' },
    { l: 'Epstein Findings', v: EPSTEIN_INTEL.keyFindings.length, s: 'Tier 1 sourced', c: '#f59e0b' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Data Source Indicator */}
      <div className="flex items-center gap-2 px-1">
        <Dot color={live ? '#10b981' : liveError ? '#ef4444' : '#f59e0b'} pulse={!!live} />
        <span className="font-mono text-[10px] tracking-wider" style={{ color: live ? '#10b981' : liveError ? '#ef4444' : '#f59e0b' }}>
          {live ? 'LIVE — VPS API' : liveError ? 'OFFLINE — STATIC FALLBACK' : 'CONNECTING...'}
        </span>
        {live && lastHB && (
          <span className="font-mono text-[10px] text-slate-500 ml-2">
            Last HB: {new Date(lastHB).toLocaleString()}
          </span>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {stats.map((s, i) => (
          <div key={i} className="animate-fadeIn bg-[#1a2235] border border-[#2a3550] rounded-lg p-3.5" style={{ borderLeft: `3px solid ${s.c}` }}>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">{s.l}</div>
            <div className="font-mono text-2xl font-bold mt-0.5" style={{ color: s.c }}>{s.v}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{s.s}</div>
          </div>
        ))}
      </div>

      {/* Agent Status Panel — NEW, only shows when live data available */}
      {agents && (
        <Card title="Agent Status — All Realms" icon="&#x1F916;" accent="#06b6d4" full>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {Object.entries(agents).map(([key, agent]) => (
              <div key={key} className="flex items-center gap-3 p-3 bg-white/[.02] rounded-lg border border-[#2a3550]">
                <Dot
                  color={agent.status === 'ACTIVE' ? '#10b981' : agent.status === 'PLANNED' ? '#64748b' : '#ef4444'}
                  pulse={agent.status === 'ACTIVE'}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold text-slate-200">{agent.name}</span>
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded" style={{
                      background: agent.status === 'ACTIVE' ? 'rgba(16,185,129,0.1)' : agent.status === 'PLANNED' ? 'rgba(100,116,139,0.1)' : 'rgba(239,68,68,0.1)',
                      color: agent.status === 'ACTIVE' ? '#10b981' : agent.status === 'PLANNED' ? '#64748b' : '#ef4444',
                    }}>
                      {agent.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {agent.realm} — {agent.platform}
                  </div>
                  {agent.lastHeartbeat && (
                    <div className="text-[9px] text-slate-600 mt-0.5 font-mono">
                      Last HB: {new Date(agent.lastHeartbeat).toLocaleTimeString()}
                    </div>
                  )}
                  {agent.lastAnalysis && (
                    <div className="text-[9px] text-slate-600 mt-0.5 font-mono">
                      Last analysis: {new Date(agent.lastAnalysis).toLocaleTimeString()}
                      {agent.model && ` (${agent.model.includes('opus') ? 'Opus' : 'Sonnet'})`}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Mission Control Analyst Status — NEW */}
      {mcStatus && (
        <Card title="Mission Control Analyst" icon="&#x1F9E0;" accent="#8b5cf6">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-[10px] text-slate-500">Last Analysis</div>
            <div className="text-[11px] text-slate-300 font-mono">{new Date(mcStatus.last_analysis as string).toLocaleString()}</div>
            <div className="text-[10px] text-slate-500">Model</div>
            <div className="text-[11px] text-slate-300 font-mono">{(mcStatus.model_used as string || '').includes('opus') ? 'Claude Opus (Critical)' : 'Claude Sonnet (Routine)'}</div>
            <div className="text-[10px] text-slate-500">Priority</div>
            <div className="text-[11px] font-mono" style={{ color: (mcStatus.priority as string) === 'critical' ? '#ef4444' : '#f59e0b' }}>{(mcStatus.priority as string || '').toUpperCase()}</div>
            <div className="text-[10px] text-slate-500">Intel Analysed</div>
            <div className="text-[11px] text-slate-300 font-mono">{mcStatus.intel_files_analysed as number} files</div>
            <div className="text-[10px] text-slate-500">Tokens Used</div>
            <div className="text-[11px] text-slate-300 font-mono">{(mcStatus.input_tokens as number || 0).toLocaleString()} in / {(mcStatus.output_tokens as number || 0).toLocaleString()} out</div>
          </div>
        </Card>
      )}

      {/* Two-column row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {/* Engagement Protocol */}
        <Card title="Engagement Protocol (40/30/30)" icon="&#x1F4CA;" accent="var(--blue, #3b82f6)">
          <div className="flex gap-0.5 h-[22px] rounded-md overflow-hidden mb-2.5">
            <div className="w-[40%] bg-blue-500 flex items-center justify-center text-[9px] font-semibold">40% COVER</div>
            <div className="w-[30%] bg-purple-500 flex items-center justify-center text-[9px] font-semibold">30% SOFT</div>
            <div className="w-[30%] bg-orange-500 flex items-center justify-center text-[9px] font-semibold">30% HARD</div>
          </div>
          <div className="text-[11px] text-slate-400 leading-relaxed">
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
                <span className={`text-[11px] ${ch.dead ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{ch.name}</span>
              </div>
              <span className="font-mono text-[9px]" style={{ color: ch.dead ? '#ef4444' : ch.active ? '#10b981' : '#64748b' }}>
                {ch.dead ? 'META RISK' : ch.active ? 'ACTIVE' : 'OFF'}
              </span>
            </div>
          ))}
        </Card>
      </div>

      {/* Critical Events — Threat Level ELEVATED */}
      <Card title="Critical Events — ELEVATED" icon="&#x26A1;" accent="#ef4444" full>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4 p-2.5 px-3.5 bg-red-500/[.08] border border-red-500/20 rounded-lg">
            <div className="font-mono text-xl font-bold text-red-400 min-w-[90px]">APR 02</div>
            <div>
              <div className="text-sm font-semibold">BofA Settlement Hearing</div>
              <div className="text-xs text-slate-400 mt-1">
                May seal or release internal compliance docs showing what BofA knew about Epstein financial operations incl. $170M Black pipeline.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-2.5 px-3.5 bg-orange-500/[.08] border border-orange-500/20 rounded-lg">
            <div className="font-mono text-xl font-bold text-orange-400 min-w-[90px]">APR 13</div>
            <div>
              <div className="text-sm font-semibold">Leon Black Response Deadline (Wyden)</div>
              <div className="text-xs text-slate-400 mt-1">
                Must address $170M payments, surveillance of women via Paul Weiss, sharing locations with Russian operative.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-2.5 px-3.5 bg-yellow-500/[.08] border border-yellow-500/20 rounded-lg">
            <div className="font-mono text-xl font-bold text-yellow-500 min-w-[90px]">APR 14</div>
            <div>
              <div className="text-sm font-semibold">Bondi Deposition — House Oversight Committee</div>
              <div className="text-xs text-slate-400 mt-1">
                AT RISK — GOP coalition fracturing. Boebert wavering (projective identification). Mace holding firm. First AG testimony under oath about selective suppression.
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Live Intel Feed */}
      <LiveIntelFeed />
    </div>
  );
}
