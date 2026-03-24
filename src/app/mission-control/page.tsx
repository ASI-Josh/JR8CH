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
          <img
            src="/images/brand/vigil-logo.png"
            alt="VIGIL"
            className="w-14 h-14 mb-3 animate-pulse object-contain"
          />
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
        {/* Top bar — stacks on mobile */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center px-4 md:px-7 py-3">
          {/* Row 1 on mobile: Logo + Op Selector + User */}
          <div className="flex items-center justify-between w-full md:w-auto">
            {/* Left: VIGIL Logo + Agency Name */}
            <div className="flex items-center gap-3">
              <img
                src="/images/brand/vigil-logo.png"
                alt="VIGIL"
                className="w-9 h-9 md:w-10 md:h-10 rounded-lg object-contain"
              />
              <div>
                <h1
                  className="text-base md:text-lg font-bold tracking-[.2em] text-cyan-400"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  VIGIL
                </h1>
                <div className="text-xs text-slate-500">Mission Control</div>
              </div>
            </div>

            {/* Mobile: user controls */}
            <div className="flex md:hidden items-center gap-2">
              {isAdmin && (
                <button onClick={() => setShowAdmin(true)} className="text-xs text-blue-400 hover:text-blue-300 font-mono">ADMIN</button>
              )}
              <button onClick={logout} className="text-xs text-slate-500 hover:text-red-400 font-mono">LOGOUT</button>
            </div>
          </div>

          {/* Center: Operation Selector */}
          <div className="flex items-center justify-center my-2 md:my-0">
            <OperationSelector current={currentOp} operations={ops} onSelect={setCurrentOp} onAddOperation={handleAddOperation} />
          </div>

          {/* Right: Status + User (desktop only) */}
          <div className="hidden md:flex items-center gap-5">
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end">
                <Dot color="#10b981" pulse />
                <span className="font-mono text-xs font-medium text-green-500">OPSEC {MISSION.opsec}</span>
              </div>
              <div className="flex items-center gap-1.5 justify-end mt-1">
                <Dot color="#f97316" />
                <span className="font-mono text-xs font-medium text-orange-500">THREAT {currentOp.threatLevel}</span>
              </div>
            </div>
            <div
              className="text-right border-l border-[#2a3550] pl-4"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <div className="text-xs text-slate-500 font-medium">DAY {MISSION.day}</div>
              <div className="text-xs text-cyan-400 mt-0.5 font-medium">{MISSION.phase}</div>
            </div>
            <div className="border-l border-[#2a3550] pl-4 flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-slate-300 font-medium">{profile.displayName}</div>
                <div className="font-mono text-[11px] text-slate-500">{profile.role.toUpperCase()}</div>
              </div>
              <div className="flex flex-col gap-1">
                {isAdmin && (
                  <button
                    onClick={() => setShowAdmin(true)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-mono font-medium"
                  >
                    ADMIN
                  </button>
                )}
                <button
                  onClick={logout}
                  className="text-[11px] text-slate-500 hover:text-red-400 font-mono font-medium"
                >
                  LOGOUT
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===== TABS ===== */}
        <div className="flex gap-px px-4 md:px-7 bg-[#111827] border-t border-[#2a3550] overflow-x-auto">
          {[...BASE_TABS, ...(isAdmin ? ADMIN_TABS : [])].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="py-3 px-3 md:px-5 text-xs md:text-[13px] font-semibold tracking-wider whitespace-nowrap transition-all"
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
      <div className="p-4 md:p-6 md:px-8 relative z-10">
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
      <div className="text-center py-8">
        <img src="/images/brand/vigil-logo.png" alt="VIGIL" className="w-8 h-8 mx-auto mb-3 opacity-20 object-contain" />
        <p
          className="text-xs text-slate-600 tracking-widest font-medium"
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
          position: relative;
        }
        .grid-bg::before {
          content: '';
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 500px;
          height: 500px;
          background: url('/images/brand/vigil-logo.png') center/contain no-repeat;
          opacity: 0.015;
          pointer-events: none;
          z-index: 0;
        }
      `}</style>
      <div className="grid-bg">
        <Dashboard />
      </div>
    </AuthProvider>
  );
}
