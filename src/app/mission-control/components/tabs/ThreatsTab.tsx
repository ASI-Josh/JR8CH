'use client';

import React from 'react';
import { Badge, Card } from '../ui';
import { VECTORS, ESCALATION } from '../../lib/mission-data';

export default function ThreatsTab() {
  return (
    <div className="flex flex-col gap-4">
      <Card title="8 Dumb AI Threat Vectors" icon="&#x1F6E1;&#xFE0F;" accent="#ef4444" full>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {VECTORS.map((v, i) => (
            <div key={i} className="flex items-start justify-between p-2.5 px-3 rounded-lg bg-white/[.02] border border-white/[.03]">
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[9px] text-slate-500">{v.id}</span>
                  <span className="text-xs font-medium">{v.name}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 leading-snug">{v.detail}</div>
              </div>
              <div className="flex-shrink-0 ml-2">
                <Badge level={v.severity} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Escalation Ladder" icon="&#x1F6A8;" accent="#f97316" full>
        {ESCALATION.map((e, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-2.5 px-3 rounded-md mb-1.5"
            style={{
              background: e.current ? 'rgba(249,115,22,.08)' : 'rgba(255,255,255,.015)',
              border: e.current ? '1px solid rgba(249,115,22,.3)' : '1px solid transparent',
            }}
          >
            <Badge level={e.level} />
            <div className="flex-1">
              <div className="text-xs">{e.trigger}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Action: {e.action}</div>
            </div>
            {e.current && (
              <span className="font-mono text-[9px] text-orange-500 animate-pulse">CURRENT</span>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}
