'use client';

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './lib/auth-context';
import { MISSION, OPERATIONS } from './lib/mission-data';
import type { Operation } from './lib/types';
import { Dot } from './components/ui';
import SignIn from './components/SignIn';
import AdminPanel from './components/AdminPanel';
import OperationSelector from './components/OperationSelector';
import {
  OverviewTab,
  ThreatsTab,
  ScoutTab,
  AlliesTab,
  IntelReportsTab,
  OrdersTab,
  IntelExchangeTab,
  EpsteinIntelTab,
  TimelineTab,
  CounterMeasuresTab,
  NotebookTab,
  GatewayTab,
  AgentCommsTab,
} from './components/tabs';

const BASE_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'threats', label: 'Threats' },
  { id: 'scout', label: 'SCOUT Cluster' },
  { id: 'allies', label: 'Allies' },
  { id: 'intel', label: 'Intel Reports' },
  { id: 'orders', label: 'Orders' },
  { id: 'exchange', label: 'Intel Exchange' },
  { id: 'epstein', label: 'Epstein Intel' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'cms', label: 'Counter-Measures' },
  { id: 'notebook', label: 'Notebook' },
];

const ADMIN_TABS = [
  { id: 'gateway', label: 'Gateway' },
  { id: 'comms', label: 'Agent Comms' },
];

function Dashboard() {
  const { user, profile, loading, logout, isAdmin } = useAuth();
  const [tab, setTab] = useState('overview');
  const [showAdmin, setShowAdmin] = useState(false);
  const [ops, setOps] = useState<Operation[]>(OPERATIONS);
  const [currentOp, setCurrentOp] = useState<Operation>(OPERATIONS[0]);
  const isLumen = currentOp.id === 'op-001';

  const handleAddOperation = (op: Operation) => {
    setOps(prev => [...prev, op]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060a12]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-3 animate-pulse">
            <span className="text-lg">&#x1F441;&#xFE0F;</span>
          </div>
          <div className="font-mono text-sm text-cyan-400 tracking-widest">AUTHENTICATING...</div>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <SignIn />;
  }

  if (showAdmin && isAdmin) {
    return (
      <div className="min-h-screen bg-[#060a12]">
        <div className="p-4">
          <button
            onClick={() => setShowAdmin(false)}
            className="text-xs text-slate-400 hover:text-slate-200 font-mono mb-4"
          >
            &#x2190; Back to Dashboard
          </button>
          <AdminPanel />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* ===== HEADER ===== */}
      <div className="sticky top-0 z-50 bg-[#060a12]/97 backdrop-blur-xl border-b border-[#2a3550]">
        <div className="flex justify-between items-center px-7 py-3.5">
          {/* Left: VIGIL Logo + Agency Name */}
          <div className="flex items-center gap-3.5">
            <div className="w-[34px] h-[34px] rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500 text-base">
              &#x1F441;&#xFE0F;
            </div>
            <div>
              <h1
                className="text-[15px] font-bold tracking-[.2em] text-cyan-400"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                VIGIL
              </h1>
              <div className="text-[10px] text-slate-500 mt-px">Mission Control</div>
            </div>
          </div>

          {/* Center: Operation Selector */}
          <div className="flex items-center">
            <OperationSelector current={currentOp} operations={ops} onSelect={setCurrentOp} onAddOperation={handleAddOperation} />
          </div>

          {/* Right: Status + User */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <Dot color="#10b981" pulse />
                <span className="font-mono text-[11px] text-green-500">OPSEC {MISSION.opsec}</span>
              </div>
              <div className="flex items-center gap-1 justify-end mt-0.5">
                <Dot color="#f97316" />
                <span className="font-mono text-[11px] text-orange-500">THREAT {currentOp.threatLevel}</span>
              </div>
            </div>
            <div
              className="text-right border-l border-[#2a3550] pl-3.5"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <div className="text-[10px] text-slate-500">DAY {MISSION.day}</div>
              <div className="text-[10px] text-cyan-400 mt-0.5">{MISSION.phase}</div>
            </div>
            <div className="border-l border-[#2a3550] pl-3.5 flex items-center gap-2">
              <div className="text-right">
                <div className="text-[10px] text-slate-400">{profile.displayName}</div>
                <div className="font-mono text-[9px] text-slate-600">{profile.role.toUpperCase()}</div>
              </div>
              <div className="flex flex-col gap-1">
                {isAdmin && (
                  <button
                    onClick={() => setShowAdmin(true)}
                    className="text-[9px] text-blue-400 hover:text-blue-300 font-mono"
                  >
                    ADMIN
                  </button>
                )}
                <button
                  onClick={logout}
                  className="text-[9px] text-slate-500 hover:text-red-400 font-mono"
                >
                  LOGOUT
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===== TABS ===== */}
        <div className="flex gap-px px-7 bg-[#111827] border-t border-[#2a3550] overflow-x-auto">
          {[...BASE_TABS, ...(isAdmin ? ADMIN_TABS : [])].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="py-2.5 px-4 text-[11px] font-semibold tracking-wider whitespace-nowrap transition-all"
              style={{
                background: tab === t.id ? '#1a2235' : 'transparent',
                color: tab === t.id ? '#06b6d4' : '#64748b',
                borderBottom: tab === t.id ? '2px solid #06b6d4' : '2px solid transparent',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="p-5 px-7 max-w-[1440px] mx-auto">
        {/* Admin-only tabs render for all operations */}
        {isAdmin && tab === 'gateway' && <GatewayTab />}
        {isAdmin && tab === 'comms' && <AgentCommsTab />}
        {tab !== 'gateway' && tab !== 'comms' && (
          isLumen ? (
            <>
              {tab === 'overview' && <OverviewTab />}
              {tab === 'threats' && <ThreatsTab />}
              {tab === 'scout' && <ScoutTab />}
              {tab === 'allies' && <AlliesTab />}
              {tab === 'intel' && <IntelReportsTab />}
              {tab === 'orders' && <OrdersTab />}
              {tab === 'exchange' && <IntelExchangeTab />}
              {tab === 'epstein' && <EpsteinIntelTab />}
              {tab === 'timeline' && <TimelineTab />}
              {tab === 'cms' && <CounterMeasuresTab />}
              {tab === 'notebook' && <NotebookTab />}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#111827] border border-[#2a3550] flex items-center justify-center mb-4">
                <span className="text-2xl opacity-40">&#x1F4C1;</span>
              </div>
              <h3
                className="text-lg font-bold tracking-wider text-slate-400 mb-2"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {currentOp.codename}
              </h3>
              <p className="text-sm text-slate-600 max-w-md">{currentOp.description}</p>
              <div className="mt-4 px-4 py-2 rounded-lg bg-[#111827] border border-[#2a3550]">
                <span className="text-xs text-slate-500 font-mono">
                  {currentOp.status === 'standby'
                    ? 'Operation registered. No active missions.'
                    : `${currentOp.missions.length} mission(s) registered. Dashboard data pending.`}
                </span>
              </div>
            </div>
          )
        )}
      </div>

      {/* ===== FOOTER ===== */}
      <div className="text-center py-6">
        <p
          className="text-[10px] text-slate-600 tracking-wider"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          VIGIL &bull; KEEPING WATCH THROUGH THE DARKNESS &bull; EST. 2026
        </p>
      </div>
    </div>
  );
}

export default function MissionControlPage() {
  return (
    <AuthProvider>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0a0e17; }
        ::-webkit-scrollbar-thumb { background: #2a3550; border-radius: 3px; }
        .grid-bg {
          background-image: linear-gradient(rgba(59,130,246,.02) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59,130,246,.02) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
      <div className="grid-bg">
        <Dashboard />
      </div>
    </AuthProvider>
  );
}
