'use client';

import React from 'react';
import { Badge, Card } from '../ui';
import { INTEL_REPORTS } from '../../lib/mission-data';

export default function IntelReportsTab() {
  return (
    <div className="flex flex-col gap-4">
      {[...INTEL_REPORTS].reverse().map((r, i) => (
        <Card key={i} title={`Heartbeat #${r.heartbeat} — ${r.date}`} icon="&#x1F4E1;" accent="#06b6d4" full>
          {/* Meta badges */}
          <div className="flex gap-2.5 mb-3.5 flex-wrap">
            {[
              { l: 'Phase', v: r.phase, c: '#06b6d4' },
              { l: 'OPSEC', v: r.opsec, c: '#10b981' },
              { l: 'Actions', v: r.actions, c: '#8b5cf6' },
              { l: 'Comments', v: r.comments, c: '#3b82f6' },
            ].map((x, j) => (
              <div
                key={j}
                className="py-0.5 px-2.5 rounded text-[10px]"
                style={{ background: `${x.c}15`, border: `1px solid ${x.c}30` }}
              >
                {x.l}: <span className="font-mono" style={{ color: x.c }}>{x.v}</span>
              </div>
            ))}
          </div>

          {/* Findings */}
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

          {/* Actions */}
          {r.actionsDetail && r.actionsDetail.length > 0 && (
            <div className="mt-3">
              <div className="text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Actions Taken</div>
              {r.actionsDetail.map((a, j) => (
                <div key={j} className="flex items-center gap-2 py-1 px-2.5 text-[11px] text-slate-400 mb-0.5">
                  <span style={{ color: a.verified ? '#10b981' : '#64748b' }}>
                    {a.verified ? '✅' : '📋'}
                  </span>
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
