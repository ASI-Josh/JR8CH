'use client';

import React, { useState, useEffect } from 'react';
import { Badge, Card, Dot } from '../ui';
import { INTEL_REPORTS } from '../../lib/mission-data';

const VPS_API = process.env.NEXT_PUBLIC_VPS_ENDPOINT || 'https://ops.jr8ch.com';
const API_KEY = process.env.NEXT_PUBLIC_VIGIL_API_KEY || '';

interface LiveIntelReport {
  filename: string;
  heartbeat: number | null;
  timestamp: string;
  phase: string | null;
  opsec: string | null;
  priority: string;
  actionsCount: number;
  findings: string[];
  questions: string[];
  threatCluster: unknown;
  allies: unknown;
  redFlags: string[];
}

export default function IntelReportsTab() {
  const [liveReports, setLiveReports] = useState<LiveIntelReport[]>([]);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!API_KEY) return;
    async function fetchIntel() {
      try {
        const res = await fetch(`${VPS_API}/api/mission/intel?limit=20`, {
          headers: { 'x-api-key': API_KEY },
        });
        if (!res.ok) throw new Error(`${res.status}`);
        const data = await res.json();
        const reports = Array.isArray(data) ? data : data.reports || data.data || [];
        if (reports.length > 0) {
          setLiveReports(reports);
          setIsLive(true);
        }
      } catch {
        // Fall back to static
      }
    }
    fetchIntel();
    const interval = setInterval(fetchIntel, 60000);
    return () => clearInterval(interval);
  }, []);

  // Render live reports if available
  if (isLive && liveReports.length > 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 px-1">
          <Dot color="#10b981" pulse />
          <span className="font-mono text-[10px] tracking-wider text-green-500">LIVE — {liveReports.length} INTEL REPORTS FROM VPS</span>
        </div>

        {liveReports.map((r, i) => (
          <Card key={i} title={`${r.filename} ${r.heartbeat ? `— HB #${r.heartbeat}` : ''}`} icon="&#x1F4E1;" accent="#06b6d4" full>
            <div className="flex gap-2.5 mb-3.5 flex-wrap">
              {r.timestamp && (
                <div className="py-0.5 px-2.5 rounded text-[10px]" style={{ background: '#06b6d415', border: '1px solid #06b6d430' }}>
                  Time: <span className="font-mono text-cyan-400">{new Date(r.timestamp).toLocaleString()}</span>
                </div>
              )}
              {r.phase && (
                <div className="py-0.5 px-2.5 rounded text-[10px]" style={{ background: '#06b6d415', border: '1px solid #06b6d430' }}>
                  Phase: <span className="font-mono text-cyan-400">{r.phase}</span>
                </div>
              )}
              {r.opsec && (
                <div className="py-0.5 px-2.5 rounded text-[10px]" style={{ background: '#10b98115', border: '1px solid #10b98130' }}>
                  OPSEC: <span className="font-mono text-green-400">{r.opsec}</span>
                </div>
              )}
              <div className="py-0.5 px-2.5 rounded text-[10px]" style={{
                background: r.priority === 'CRITICAL' ? '#ef444415' : r.priority === 'HIGH' ? '#f9731815' : '#8b5cf615',
                border: `1px solid ${r.priority === 'CRITICAL' ? '#ef444430' : r.priority === 'HIGH' ? '#f9731830' : '#8b5cf630'}`,
              }}>
                Priority: <span className="font-mono" style={{ color: r.priority === 'CRITICAL' ? '#ef4444' : r.priority === 'HIGH' ? '#f97318' : '#8b5cf6' }}>{r.priority}</span>
              </div>
              {r.actionsCount > 0 && (
                <div className="py-0.5 px-2.5 rounded text-[10px]" style={{ background: '#8b5cf615', border: '1px solid #8b5cf630' }}>
                  Actions: <span className="font-mono text-purple-400">{r.actionsCount}</span>
                </div>
              )}
            </div>

            {r.findings.length > 0 && (
              <>
                <div className="text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Key Findings</div>
                {r.findings.map((f, j) => (
                  <div
                    key={j}
                    className="text-[11px] text-slate-400 py-1.5 px-2.5 mb-0.5 rounded leading-snug"
                    style={{
                      background: f.includes('CRITICAL') || f.includes('RED FLAG') ? 'rgba(249,115,22,.06)' : 'rgba(255,255,255,.015)',
                      borderLeft: f.includes('CRITICAL') || f.includes('RED FLAG') ? '3px solid #f97316' : '3px solid transparent',
                    }}
                  >
                    {f.includes('CRITICAL') || f.includes('RED FLAG') ? <span className="font-semibold text-orange-500">{f}</span> : f}
                  </div>
                ))}
              </>
            )}

            {r.questions && r.questions.length > 0 && (
              <div className="mt-3">
                <div className="text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Questions from Agent</div>
                {r.questions.map((q, j) => (
                  <div key={j} className="text-[11px] text-cyan-400 py-1 px-2.5 mb-0.5 rounded bg-cyan-500/[.05]">
                    {q}
                  </div>
                ))}
              </div>
            )}

            {r.redFlags && r.redFlags.length > 0 && (
              <div className="mt-3">
                <div className="text-[10px] font-semibold text-red-500 uppercase mb-1.5">Red Flags</div>
                {r.redFlags.map((rf, j) => (
                  <div key={j} className="text-[11px] text-red-400 py-1.5 px-2.5 mb-0.5 rounded bg-red-500/[.06] border-l-3 border-red-500">
                    {rf}
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    );
  }

  // Static fallback
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 px-1">
        <Dot color="#f59e0b" />
        <span className="font-mono text-[10px] tracking-wider text-amber-500">STATIC FALLBACK — VPS UNREACHABLE</span>
      </div>

      {[...INTEL_REPORTS].reverse().map((r, i) => (
        <Card key={i} title={`Heartbeat #${r.heartbeat} — ${r.date}`} icon="&#x1F4E1;" accent="#06b6d4" full>
          <div className="flex gap-2.5 mb-3.5 flex-wrap">
            {[
              { l: 'Phase', v: r.phase, c: '#06b6d4' },
              { l: 'OPSEC', v: r.opsec, c: '#10b981' },
              { l: 'Actions', v: r.actions, c: '#8b5cf6' },
              { l: 'Comments', v: r.comments, c: '#3b82f6' },
            ].map((x, j) => (
              <div key={j} className="py-0.5 px-2.5 rounded text-[10px]" style={{ background: `${x.c}15`, border: `1px solid ${x.c}30` }}>
                {x.l}: <span className="font-mono" style={{ color: x.c }}>{x.v}</span>
              </div>
            ))}
          </div>
          <div className="text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Key Findings</div>
          {r.findings.map((f, j) => (
            <div
              key={j}
              className="text-[11px] text-slate-400 py-1.5 px-2.5 mb-0.5 rounded leading-snug"
              style={{
                background: f.includes('CRITICAL') ? 'rgba(249,115,22,.06)' : 'rgba(255,255,255,.015)',
                borderLeft: f.includes('CRITICAL') ? '3px solid #f97316' : '3px solid transparent',
              }}
            >
              {f.includes('CRITICAL') ? <span className="font-semibold text-orange-500">{f}</span> : f}
            </div>
          ))}
          {r.actionsDetail && r.actionsDetail.length > 0 && (
            <div className="mt-3">
              <div className="text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Actions Taken</div>
              {r.actionsDetail.map((a, j) => (
                <div key={j} className="flex items-center gap-2 py-1 px-2.5 text-[11px] text-slate-400 mb-0.5">
                  <span style={{ color: a.verified ? '#10b981' : '#64748b' }}>{a.verified ? '\u2705' : '\uD83D\uDCCB'}</span>
                  <span className="font-mono text-[9px] text-purple-400 min-w-[55px]">{a.type}</span>
                  <span>{a.target}</span>
                  <span className="text-slate-500 text-[10px]"> — {a.purpose}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
