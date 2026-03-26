'use client';

import React, { useState, useEffect } from 'react';
import { Dot } from '../ui';

const VPS_API = process.env.NEXT_PUBLIC_VPS_ENDPOINT || 'https://ops.jr8ch.com';
const API_KEY = process.env.NEXT_PUBLIC_VIGIL_API_KEY || '';

interface Hypothesis {
  id: string;
  title: string;
  status: 'ACTIVE' | 'CONFIRMED' | 'DISPROVEN' | 'UNDER_REVIEW';
  analyst: string;
  filed: string;
  classification: string;
  crossRef: string[];
  statement: string;
  evidence: string[];
  implications: string[];
  raw?: string;
}

// Static hypotheses data — will be replaced by VPS data when available
const HYPOTHESES: Hypothesis[] = [
  {
    id: 'H-001',
    title: 'THE WEAPONISED ARCHITECTURE THESIS',
    status: 'ACTIVE',
    analyst: 'MERIDIAN',
    filed: '2026-03-27',
    classification: 'Vigil Agency — Official Hypothesis',
    crossRef: ['Project Lumen (US)', 'Project Southern Cross (AU)'],
    statement: 'The same AI architecture that Palantir Technologies developed for military kill-chain acceleration (Maven Smart System) — which processes 1,000+ targets in 24 hours and compresses lethal decision-making to under 90 seconds — could be, and demonstrably should be, deployed to map child trafficking networks, identify missing children, trace financial flows to exploitation operations, and dismantle the institutional protection apparatus that enables elite-level child abuse. The technology exists. The data exists. The choice of application is political.',
    evidence: [
      'Maven Smart System fuses 8-9 separate intelligence systems into single platform — confirmed by CDAO Cameron Stanley at AIPCon 9',
      'Kill chain reduced from hours to minutes via 3-click workflow — "left click, right click, left click"',
      '20 operators now do work of 2,000 intelligence officers — 100:1 efficiency multiplier',
      'Palantir holds ICE contract ($41M 2014 + $30M 2025) — immigration records, detention, separated child tracking',
      'Palantir holds ACIC (Australia) contract — criminal intelligence across jurisdictions',
      'Palantir holds AUSTRAC contract — financial transaction monitoring, suspicious transactions',
      'ImmigrationOS provides "near real-time visibility" into migrant movements',
      'Thousands of separated children lost and remain unaccounted for under ICE systems Palantir built',
      'Operation Epic Fury used Maven to process Iranian targets while domestic trafficking networks remain unmapped',
    ],
    implications: [
      'The technology to map and dismantle trafficking networks already exists and is deployed by the same agencies that should be investigating them',
      'The choice to point AI at foreign kill targets rather than domestic child protection is a policy decision, not a technology limitation',
      'Palantir\'s data fusion capability (connecting disparate systems) is precisely what\'s needed for cross-jurisdictional trafficking investigation',
      'This constitutes what the hypothesis identifies as "the central moral failure of 21st-century defence technology"',
      'Counter-narrative opportunity: public awareness of this capability gap could drive political pressure for redeployment',
    ],
  },
];

function statusColor(s: string) {
  switch (s) {
    case 'ACTIVE': return '#3b82f6';
    case 'CONFIRMED': return '#10b981';
    case 'DISPROVEN': return '#ef4444';
    case 'UNDER_REVIEW': return '#f59e0b';
    default: return '#64748b';
  }
}

function renderMarkdownBlock(raw: string) {
  return raw.split('\n').map((line, i) => {
    const t = line.trim();
    if (!t) return <div key={i} className="h-2" />;
    if (t.startsWith('# ')) return <h2 key={i} className="text-lg font-bold text-cyan-400 mt-5 mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{t.slice(2)}</h2>;
    if (t.startsWith('## ')) return <h3 key={i} className="text-base font-bold text-slate-200 mt-4 mb-2 border-b border-[#2a3550] pb-1.5">{t.slice(3)}</h3>;
    if (t.startsWith('### ')) return <h4 key={i} className="text-[14px] font-semibold text-purple-400 mt-3 mb-1">{t.slice(4)}</h4>;
    if (t.startsWith('- ') || t.startsWith('* ')) {
      const content = t.slice(2);
      const isImportant = /CRITICAL|CONFIRMED|TIER 1|DOCUMENTED/i.test(content);
      return (
        <div key={i} className={`flex items-start gap-2 text-[13px] leading-relaxed pl-3 py-1 ${isImportant ? 'text-amber-400 font-medium' : 'text-slate-400'}`}>
          <span className="text-slate-600 mt-0.5">{'\u25B8'}</span>
          <span>{content}</span>
        </div>
      );
    }
    if (/^\d+\./.test(t)) {
      const num = t.match(/^(\d+)/)?.[1];
      const content = t.replace(/^\d+\.\s*/, '');
      return (
        <div key={i} className="flex items-start gap-3 text-[13px] leading-relaxed pl-3 py-1 text-slate-300">
          <span className="font-mono text-cyan-500 font-bold min-w-[24px]">{num}.</span>
          <span>{content}</span>
        </div>
      );
    }
    if (t.startsWith('**') && t.endsWith('**')) return <div key={i} className="text-[14px] font-bold text-slate-200 mt-2 mb-1">{t.replace(/\*\*/g, '')}</div>;
    if (t.startsWith('>')) return <div key={i} className="text-[13px] text-amber-400/80 italic pl-4 border-l-2 border-amber-500/30 my-2 py-1">{t.slice(1).trim()}</div>;
    if (t.startsWith('|')) return <div key={i} className="text-[12px] text-slate-400 font-mono py-0.5">{t}</div>;
    if (t.startsWith('---')) return <hr key={i} className="border-[#2a3550] my-4" />;
    const rendered = t.replace(/\*\*([^*]+)\*\*/g, '<b class="text-slate-200 font-semibold">$1</b>');
    return <div key={i} className="text-[13px] text-slate-400 leading-relaxed py-0.5" dangerouslySetInnerHTML={{ __html: rendered }} />;
  });
}

export default function HypothesesTab() {
  const [expanded, setExpanded] = useState<string | null>(HYPOTHESES[0]?.id || null);
  const [showRaw, setShowRaw] = useState(false);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!API_KEY) return;
    async function check() {
      try { const r = await fetch(`${VPS_API}/api/health`); if (r.ok) setIsLive(true); } catch {}
    }
    check();
  }, []);

  return (
    <div className="flex flex-col gap-5">
      {/* Status */}
      <div className="flex items-center gap-2 px-1">
        <Dot color={isLive ? '#10b981' : '#f59e0b'} pulse={isLive} />
        <span className="font-mono text-xs tracking-wider" style={{ color: isLive ? '#10b981' : '#f59e0b' }}>
          {isLive ? `LIVE \u2014 ${HYPOTHESES.length} FORMAL HYPOTHESES` : 'STATIC DATA'}
        </span>
      </div>

      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-blue-500/[.08] to-purple-500/[.04] border border-blue-500/20 rounded-xl">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xl">{'\uD83E\uDDE0'}</span>
          <h2 className="text-base font-bold text-blue-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>HYPOTHESES REGISTER</h2>
        </div>
        <p className="text-[14px] text-slate-300 leading-relaxed">
          Formal investigative hypotheses developed through OSINT collaboration across VIGIL operations.
          Each hypothesis is evidence-graded, cross-referenced across projects, and continuously updated as new intelligence is gathered.
          These represent structured counter-narratives backed by documented evidence.
        </p>
      </div>

      {/* Hypotheses */}
      {HYPOTHESES.map(h => {
        const isExpanded = expanded === h.id;
        const color = statusColor(h.status);

        return (
          <div key={h.id} className="bg-[#111b2a] border border-[#1e2d44] rounded-xl overflow-hidden" style={{ borderLeft: `3px solid ${color}` }}>
            {/* Header */}
            <div
              className="flex items-start justify-between px-5 py-4 cursor-pointer hover:bg-[#131f30] transition-colors"
              onClick={() => setExpanded(isExpanded ? null : h.id)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <span className="font-mono text-[13px] font-bold text-cyan-400">{h.id}</span>
                  <span className="text-[15px] font-bold text-slate-200">{h.title}</span>
                  <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full font-bold" style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
                    {h.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[12px] text-slate-500">
                  <span>Analyst: <span className="text-purple-400 font-semibold">{h.analyst}</span></span>
                  <span>{'\u2022'}</span>
                  <span>Filed: {h.filed}</span>
                  <span>{'\u2022'}</span>
                  <span>{h.classification}</span>
                </div>
                <div className="flex gap-1.5 mt-2">
                  {h.crossRef.map((ref, i) => (
                    <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {ref}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-slate-500 text-sm shrink-0 ml-3">{isExpanded ? '\u25BE' : '\u25B8'}</span>
            </div>

            {/* Expanded content */}
            {isExpanded && (
              <div className="border-t border-[#1e2d44]">
                {/* Hypothesis Statement */}
                <div className="px-5 py-4">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Hypothesis Statement</div>
                  <div className="text-[14px] text-slate-200 leading-relaxed p-4 rounded-xl bg-[#0a0f18] border border-[#1a2740] italic">
                    {h.statement}
                  </div>
                </div>

                {/* Evidence */}
                <div className="px-5 pb-4">
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2">
                    Evidentiary Basis ({h.evidence.length} points)
                  </div>
                  <div className="space-y-1.5">
                    {h.evidence.map((e, i) => (
                      <div key={i} className="flex items-start gap-3 py-2 px-3 rounded-lg bg-amber-500/[.04] border border-amber-500/[.08]">
                        <span className="font-mono text-[12px] font-bold text-amber-500 shrink-0 mt-px">E{i + 1}</span>
                        <span className="text-[13px] text-slate-300 leading-relaxed">{e}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Implications */}
                <div className="px-5 pb-4">
                  <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider mb-2">
                    Strategic Implications ({h.implications.length})
                  </div>
                  <div className="space-y-1.5">
                    {h.implications.map((imp, i) => (
                      <div key={i} className="flex items-start gap-3 py-2 px-3 rounded-lg bg-purple-500/[.04] border border-purple-500/[.08]">
                        <span className="font-mono text-[12px] font-bold text-purple-400 shrink-0 mt-px">I{i + 1}</span>
                        <span className="text-[13px] text-slate-300 leading-relaxed">{imp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Full Document Toggle */}
                {h.raw && (
                  <div className="px-5 pb-5">
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowRaw(!showRaw); }}
                      className="font-mono text-[11px] text-cyan-500 hover:text-cyan-400 transition-colors"
                    >
                      {showRaw ? '\u25BE HIDE FULL DOCUMENT' : '\u25B8 VIEW FULL DOCUMENT'}
                    </button>
                    {showRaw && (
                      <div className="mt-3 bg-[#0a0f18] rounded-xl p-5 border border-[#1a2740] max-h-[600px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                        {renderMarkdownBlock(h.raw)}
                      </div>
                    )}
                  </div>
                )}

                {/* Meta footer */}
                <div className="px-5 pb-4 flex items-center gap-4 text-[11px] text-slate-600 font-mono">
                  <span>{h.evidence.length} evidence points</span>
                  <span>{'\u2022'}</span>
                  <span>{h.implications.length} implications</span>
                  <span>{'\u2022'}</span>
                  <span>{h.crossRef.length} cross-references</span>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Empty state for future hypotheses */}
      <div className="p-4 rounded-xl bg-[#111b2a] border border-dashed border-[#2a3550] text-center">
        <div className="text-[13px] text-slate-500">
          New hypotheses are generated through OSINT collaboration sessions with MERIDIAN.
          Each hypothesis follows a structured format: statement, evidence, implications, cross-references.
        </div>
      </div>
    </div>
  );
}
