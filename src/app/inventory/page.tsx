'use client';

import React, { useState, useEffect, useRef } from 'react';

// ===================== TYPES =====================

interface Item {
  id: string;
  name: string;
  category: string;
  barcode: string;
  unitCost: number;
  reorderThreshold: number;
  unit: string;
  active: boolean;
  createdAt: string;
}

interface Transaction {
  id: string;
  date: string;
  day: string;
  week: string;
  barcode: string;
  itemName: string;
  category: string;
  type: 'IN' | 'OUT' | 'PURCHASE';
  quantity: number;
  unitCost: number;
  value: number;
}

type View = 'dashboard' | 'scan' | 'items' | 'transactions' | 'add-item' | 'monthly';

const CATEGORIES = [
  'Food & Beverage', 'Cleaning Supplies', 'Office Supplies', 'Personal Care',
  'Medical', 'Tools & Hardware', 'Packaging', 'Raw Materials', 'Other',
];

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// ===================== HELPERS =====================

function generateId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function getWeekNumber(d: Date): string {
  const start = new Date(d.getFullYear(), 0, 1);
  return `W${Math.ceil((d.getTime() - start.getTime()) / 604800000)}`;
}
function fmt(v: number): string { return `$${v.toFixed(2)}`; }
function getStock(barcode: string, tx: Transaction[]): number {
  return tx.filter(t => t.barcode === barcode).reduce((s, t) => t.type === 'OUT' ? s - t.quantity : s + t.quantity, 0);
}
function loadData<T>(key: string, fb: T): T {
  if (typeof window === 'undefined') return fb;
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fb; } catch { return fb; }
}
function saveData<T>(key: string, data: T) { if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(data)); }

// ===================== UI COMPONENTS =====================

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${className}`}>{children}</div>;
}

function Stat({ label, value, sub, trend, accent }: { label: string; value: string | number; sub?: string; trend?: 'up' | 'down' | 'neutral'; accent?: string }) {
  return (
    <div className="p-5">
      <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.08em] mb-2">{label}</div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-extrabold tracking-tight" style={{ color: accent || '#111827' }}>{value}</span>
        {trend && trend !== 'neutral' && (
          <span className={`text-xs font-semibold mb-1 ${trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
            {trend === 'up' ? '\u2191' : '\u2193'}
          </span>
        )}
      </div>
      {sub && <div className="text-xs text-gray-400 mt-1 font-medium">{sub}</div>}
    </div>
  );
}

function Tag({ text, color }: { text: string; color: string }) {
  return (
    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.06em]" style={{
      background: `${color}0D`, color, border: `1px solid ${color}20`,
    }}>{text}</span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[22px] font-extrabold text-gray-900 tracking-tight">{children}</h2>;
}

function InputField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.08em] mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

const inputClass = "w-full py-3 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder:text-gray-300";
const inputMonoClass = `${inputClass} font-mono`;
const btnPrimary = "w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all text-sm tracking-wide";
const btnDanger = "w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all text-sm tracking-wide";
const btnSuccess = "w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all text-sm tracking-wide";

// ===================== DASHBOARD =====================

function DashboardView({ items, transactions }: { items: Item[]; transactions: Transaction[] }) {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const weekTx = transactions.filter(t => new Date(t.date) >= weekStart);
  const weekOut = weekTx.filter(t => t.type === 'OUT');
  const weekIn = weekTx.filter(t => t.type === 'IN' || t.type === 'PURCHASE');

  const totalStockValue = items.reduce((s, item) => s + (getStock(item.barcode, transactions) * item.unitCost), 0);
  const weekConsumptionQty = weekOut.reduce((s, t) => s + t.quantity, 0);
  const weekConsumptionVal = weekOut.reduce((s, t) => s + t.value, 0);
  const weekPurchaseVal = weekIn.reduce((s, t) => s + t.value, 0);

  const lowStock = items.filter(item => getStock(item.barcode, transactions) <= item.reorderThreshold && item.active);

  const categorySpend = weekOut.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.value; return acc;
  }, {});

  const itemUsage = weekOut.reduce<Record<string, number>>((acc, t) => {
    acc[t.itemName] = (acc[t.itemName] || 0) + t.quantity; return acc;
  }, {});
  const topItems = Object.entries(itemUsage).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const dailyUsage = DAYS.map((day, i) => {
    const d = new Date(weekStart); d.setDate(weekStart.getDate() + i);
    const ds = d.toISOString().split('T')[0];
    return { day: day.slice(0, 3), qty: weekOut.filter(t => t.date.startsWith(ds)).reduce((s, t) => s + t.quantity, 0) };
  });
  const maxDaily = Math.max(...dailyUsage.map(d => d.qty), 1);

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <SectionTitle>Weekly Overview</SectionTitle>
          <p className="text-sm text-gray-400 mt-1">Performance summary for the current week</p>
        </div>
        <div className="text-[11px] text-gray-400 font-medium">
          {weekStart.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })} &mdash; {now.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><Stat label="Portfolio Value" value={fmt(totalStockValue)} accent="#111827" /></Card>
        <Card><Stat label="Consumption" value={weekConsumptionQty} sub={fmt(weekConsumptionVal)} accent="#f59e0b" /></Card>
        <Card><Stat label="Procurement" value={fmt(weekPurchaseVal)} accent="#10b981" /></Card>
        <Card><Stat label="Reorder Alerts" value={lowStock.length} sub={lowStock.length > 0 ? 'Items below threshold' : 'All items stocked'} accent={lowStock.length > 0 ? '#ef4444' : '#10b981'} /></Card>
      </div>

      {/* Low Stock */}
      {lowStock.length > 0 && (
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-bold text-gray-900">Critical Stock Levels</span>
            <Tag text={`${lowStock.length} items`} color="#ef4444" />
          </div>
          <div className="divide-y divide-gray-50">
            {lowStock.map(item => {
              const stock = getStock(item.barcode, transactions);
              return (
                <div key={item.id} className="flex items-center justify-between px-6 py-3.5">
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{item.name}</div>
                    <div className="text-xs text-gray-400">{item.category}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold font-mono text-red-600">{stock}</span>
                    <span className="text-xs text-gray-400 ml-1">/ {item.reorderThreshold} {item.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Consumption */}
        <Card className="p-6">
          <div className="text-sm font-bold text-gray-900 mb-5">Daily Consumption</div>
          <div className="flex items-end gap-3 h-40">
            {dailyUsage.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-[11px] font-bold font-mono text-gray-500">{d.qty || ''}</div>
                <div className="w-full rounded-lg transition-all" style={{
                  height: `${Math.max((d.qty / maxDaily) * 100, d.qty > 0 ? 6 : 0)}%`,
                  background: d.qty > 0 ? 'linear-gradient(180deg, #111827, #374151)' : '#f3f4f6',
                  minHeight: d.qty > 0 ? '8px' : '4px',
                }} />
                <div className="text-[11px] font-semibold text-gray-400">{d.day}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Spend by Category */}
        <Card className="p-6">
          <div className="text-sm font-bold text-gray-900 mb-5">Expenditure by Category</div>
          {Object.keys(categorySpend).length === 0 ? (
            <div className="flex items-center justify-center h-40 text-sm text-gray-300">No expenditure data this week</div>
          ) : (
            <div className="space-y-4">
              {Object.entries(categorySpend).sort((a, b) => b[1] - a[1]).map(([cat, val]) => {
                const maxVal = Math.max(...Object.values(categorySpend), 1);
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-semibold text-gray-600">{cat}</span>
                      <span className="font-mono font-bold text-gray-800">{fmt(val)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gray-900 transition-all" style={{ width: `${(val / maxVal) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Top Consumed */}
        <Card className="p-6">
          <div className="text-sm font-bold text-gray-900 mb-5">Highest Consumption Items</div>
          {topItems.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-sm text-gray-300">No consumption data</div>
          ) : (
            <div className="space-y-3.5">
              {topItems.map(([name, qty], i) => (
                <div key={name} className="flex items-center gap-4">
                  <span className="w-7 h-7 rounded-lg bg-gray-900 text-white text-[11px] font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="flex-1 text-sm font-medium text-gray-700">{name}</span>
                  <span className="font-mono text-sm font-bold text-gray-900">{qty}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Stats */}
        <Card className="p-6">
          <div className="text-sm font-bold text-gray-900 mb-5">Inventory Summary</div>
          <div className="space-y-3">
            {[
              { label: 'Total SKUs', value: items.length, color: '#6366f1' },
              { label: 'Active Items', value: items.filter(i => i.active).length, color: '#10b981' },
              { label: 'Categories', value: new Set(items.map(i => i.category)).size, color: '#f59e0b' },
              { label: 'Transactions (All Time)', value: transactions.length, color: '#3b82f6' },
              { label: 'This Week', value: transactions.filter(t => new Date(t.date) >= weekStart).length, color: '#8b5cf6' },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-500">{s.label}</span>
                <span className="text-lg font-bold font-mono" style={{ color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ===================== SCAN VIEW =====================

function CameraScanner({ onScan, onClose }: { onScan: (code: string) => void; onClose: () => void }) {
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { Html5Qrcode } = await import('html5-qrcode');
      if (!mounted || !scannerRef.current) return;
      const scanner = new Html5Qrcode('camera-scanner');
      html5QrRef.current = scanner;
      try {
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 280, height: 150 }, aspectRatio: 1.5 },
          (decodedText: string) => {
            onScan(decodedText);
            scanner.stop().catch(() => {});
          },
          () => {},
        );
      } catch (err) {
        console.error('Camera error:', err);
      }
    })();
    return () => {
      mounted = false;
      html5QrRef.current?.stop().catch(() => {});
    };
  }, [onScan]);

  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <span className="text-sm font-bold text-gray-900">Camera Scanner</span>
        <button onClick={onClose} className="text-xs font-bold text-gray-500 hover:text-red-600 px-3 py-1 rounded-lg border border-gray-200 hover:border-red-200 transition-all">
          Close Camera
        </button>
      </div>
      <div className="bg-black flex items-center justify-center" style={{ minHeight: '280px' }}>
        <div id="camera-scanner" ref={scannerRef} className="w-full" />
      </div>
      <div className="px-6 py-3 text-center text-xs text-gray-400">Point your camera at a barcode</div>
    </Card>
  );
}

function ScanView({ items, transactions, onTransaction }: { items: Item[]; transactions: Transaction[]; onTransaction: (t: Transaction) => void }) {
  const [barcode, setBarcode] = useState('');
  const [matched, setMatched] = useState<Item | null>(null);
  const [txType, setTxType] = useState<'IN' | 'OUT' | 'PURCHASE'>('OUT');
  const [qty, setQty] = useState(1);
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const lookupBarcode = (code: string) => {
    setBarcode(code);
    const item = items.find(i => i.barcode === code.trim());
    if (item) { setMatched(item); setFeedback(null); setShowCamera(false); }
    else { setMatched(null); setFeedback({ msg: `No item found for barcode: ${code}`, ok: false }); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && barcode.trim()) lookupBarcode(barcode.trim());
  };

  const handleSubmit = () => {
    if (!matched) return;
    const stock = getStock(matched.barcode, transactions);
    if (txType === 'OUT' && stock < qty) {
      setFeedback({ msg: `Insufficient stock. Only ${stock} available.`, ok: false }); return;
    }
    const now = new Date();
    onTransaction({
      id: generateId(), date: now.toISOString(), day: DAYS[now.getDay()], week: getWeekNumber(now),
      barcode: matched.barcode, itemName: matched.name, category: matched.category,
      type: txType, quantity: qty, unitCost: matched.unitCost, value: qty * matched.unitCost,
    });
    setFeedback({ msg: `${txType === 'OUT' ? 'Removed' : 'Added'} ${qty}x ${matched.name}`, ok: true });
    setBarcode(''); setMatched(null); setQty(1);
    inputRef.current?.focus();
  };

  const currentStock = matched ? getStock(matched.barcode, transactions) : 0;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <SectionTitle>Scan &amp; Record</SectionTitle>

      <Card className="p-8">
        <InputField label="Barcode Input">
          <input
            ref={inputRef} type="text" value={barcode} onChange={e => setBarcode(e.target.value)} onKeyDown={handleKeyDown}
            placeholder="Scan barcode or type manually..."
            className={`${inputMonoClass} text-xl text-center py-5`} autoFocus
          />
        </InputField>
        <div className="flex items-center justify-center gap-4 mt-4">
          <p className="text-[11px] text-gray-300 tracking-wide">Bluetooth scanner auto-submits on Enter</p>
          <span className="text-gray-200">|</span>
          <button
            onClick={() => setShowCamera(!showCamera)}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 tracking-wide transition-colors"
          >
            {showCamera ? 'Hide Camera' : 'Use Phone Camera'}
          </button>
        </div>
      </Card>

      {showCamera && (
        <CameraScanner onScan={lookupBarcode} onClose={() => setShowCamera(false)} />
      )}

      {feedback && (
        <div className={`p-4 rounded-xl text-sm font-semibold text-center border ${feedback.ok ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
          {feedback.msg}
        </div>
      )}

      {matched && (
        <Card className="p-6 space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xl font-extrabold text-gray-900">{matched.name}</div>
              <div className="flex items-center gap-2 mt-1.5">
                <Tag text={matched.category} color="#6366f1" />
                <span className="text-xs text-gray-400 font-mono">{matched.barcode}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-extrabold font-mono" style={{ color: currentStock <= matched.reorderThreshold ? '#ef4444' : '#10b981' }}>
                {currentStock}
              </div>
              <div className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide">{matched.unit} in stock</div>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          <InputField label="Transaction Type">
            <div className="grid grid-cols-3 gap-2">
              {(['OUT', 'IN', 'PURCHASE'] as const).map(type => (
                <button
                  key={type} onClick={() => setTxType(type)}
                  className={`py-3 rounded-xl text-sm font-bold transition-all border-2 ${
                    txType === type
                      ? type === 'OUT' ? 'bg-red-600 text-white border-red-600' : 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {type === 'OUT' ? 'Use / Remove' : type === 'IN' ? 'Restock' : 'Purchase'}
                </button>
              ))}
            </div>
          </InputField>

          <InputField label="Quantity">
            <div className="flex items-center gap-3">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-14 h-14 rounded-xl bg-gray-100 hover:bg-gray-200 text-xl font-bold transition-all">-</button>
              <input type="number" value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                className={`${inputMonoClass} text-center text-3xl font-extrabold py-3`} />
              <button onClick={() => setQty(qty + 1)} className="w-14 h-14 rounded-xl bg-gray-100 hover:bg-gray-200 text-xl font-bold transition-all">+</button>
            </div>
          </InputField>

          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
            <span className="text-sm text-gray-500 font-medium">Transaction Value</span>
            <span className="text-2xl font-extrabold font-mono text-gray-900">{fmt(qty * matched.unitCost)}</span>
          </div>

          <button onClick={handleSubmit} className={txType === 'OUT' ? btnDanger : btnSuccess}>
            {txType === 'OUT' ? `Remove ${qty}x ${matched.name}` : `Add ${qty}x ${matched.name}`}
          </button>
        </Card>
      )}
    </div>
  );
}

// ===================== ITEMS VIEW =====================

function ItemsView({ items, transactions }: { items: Item[]; transactions: Transaction[] }) {
  const [search, setSearch] = useState('');
  const filtered = items.filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.barcode.includes(search));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <SectionTitle>Inventory Register</SectionTitle>
        <span className="text-sm text-gray-400 font-medium">{items.length} items</span>
      </div>

      <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items or barcodes..."
        className={inputClass} />

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-300 text-sm">
          {items.length === 0 ? 'No items registered. Add your first item to begin.' : 'No items match your search.'}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => {
            const stock = getStock(item.barcode, transactions);
            const isLow = stock <= item.reorderThreshold;
            return (
              <Card key={item.id} className="p-5 flex items-center gap-5 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold" style={{
                  background: isLow ? '#fef2f2' : '#f0fdf4',
                  color: isLow ? '#ef4444' : '#10b981',
                }}>{stock}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-sm font-bold text-gray-900">{item.name}</span>
                    <Tag text={item.category} color="#6366f1" />
                    {isLow && <Tag text="Reorder" color="#ef4444" />}
                    {!item.active && <Tag text="Inactive" color="#9ca3af" />}
                  </div>
                  <div className="text-xs text-gray-400 mt-1 font-mono">{item.barcode} &middot; {fmt(item.unitCost)}/{item.unit} &middot; Threshold: {item.reorderThreshold}</div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ===================== ADD ITEM =====================

function AddItemView({ items, onAdd }: { items: Item[]; onAdd: (item: Item) => void }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [barcode, setBarcode] = useState('');
  const [unitCost, setUnitCost] = useState('');
  const [reorder, setReorder] = useState('5');
  const [unit, setUnit] = useState('units');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const barcodeRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (!name || !barcode || !unitCost) { setError('Name, barcode, and unit cost are required.'); return; }
    if (items.some(i => i.barcode === barcode)) { setError('This barcode is already registered.'); return; }
    onAdd({
      id: generateId(), name, category, barcode,
      unitCost: parseFloat(unitCost), reorderThreshold: parseInt(reorder) || 5,
      unit, active: true, createdAt: new Date().toISOString(),
    });
    setSuccess(`${name} has been registered.`);
    setName(''); setBarcode(''); setUnitCost(''); setReorder('5');
    barcodeRef.current?.focus();
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <SectionTitle>Register New Item</SectionTitle>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm font-semibold text-red-700">{error}</div>}
      {success && <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-semibold text-emerald-700">{success}</div>}

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField label="Barcode *">
            <input ref={barcodeRef} type="text" value={barcode} onChange={e => setBarcode(e.target.value)}
              placeholder="Scan or type barcode" className={`${inputMonoClass} text-lg`} autoFocus />
          </InputField>
          <InputField label="Item Name *">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Paper Towels" className={inputClass} />
          </InputField>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Category">
              <select value={category} onChange={e => setCategory(e.target.value)} className={inputClass}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </InputField>
            <InputField label="Unit of Measure">
              <select value={unit} onChange={e => setUnit(e.target.value)} className={inputClass}>
                {['units', 'kg', 'litres', 'packs', 'boxes', 'rolls', 'bottles', 'cans', 'bags', 'pairs'].map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </InputField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Unit Cost ($) *">
              <input type="number" step="0.01" value={unitCost} onChange={e => setUnitCost(e.target.value)} placeholder="0.00" className={inputMonoClass} />
            </InputField>
            <InputField label="Reorder Threshold">
              <input type="number" value={reorder} onChange={e => setReorder(e.target.value)} placeholder="5" className={inputMonoClass} />
            </InputField>
          </div>
          <button type="submit" className={btnPrimary}>Register Item</button>
        </form>
      </Card>
    </div>
  );
}

// ===================== TRANSACTIONS =====================

function TransactionsView({ transactions }: { transactions: Transaction[] }) {
  const sorted = [...transactions].reverse();
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <SectionTitle>Transaction Ledger</SectionTitle>
        <span className="text-sm text-gray-400 font-medium">{transactions.length} entries</span>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-16 text-gray-300 text-sm">No transactions recorded.</div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.08em]">Timestamp</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.08em]">Item</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.08em]">Type</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.08em] text-right">Qty</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.08em] text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sorted.slice(0, 100).map(t => (
                  <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-3.5 text-gray-500 whitespace-nowrap font-mono text-xs">
                      {new Date(t.date).toLocaleString('en-AU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="font-semibold text-gray-800">{t.itemName}</div>
                      <div className="text-[11px] text-gray-400">{t.category}</div>
                    </td>
                    <td className="px-6 py-3.5"><Tag text={t.type} color={t.type === 'OUT' ? '#ef4444' : '#10b981'} /></td>
                    <td className="px-6 py-3.5 text-right font-mono font-bold" style={{ color: t.type === 'OUT' ? '#ef4444' : '#10b981' }}>
                      {t.type === 'OUT' ? '-' : '+'}{t.quantity}
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono font-semibold text-gray-700">{fmt(t.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

// ===================== MONTHLY REGISTER =====================

function MonthlyView({ transactions }: { transactions: Transaction[] }) {
  const months: Record<string, Transaction[]> = {};
  transactions.forEach(t => {
    const d = new Date(t.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!months[key]) months[key] = [];
    months[key].push(t);
  });

  const sortedMonths = Object.keys(months).sort().reverse();

  return (
    <div className="space-y-6">
      <SectionTitle>Monthly Register</SectionTitle>

      {sortedMonths.length === 0 ? (
        <div className="text-center py-16 text-gray-300 text-sm">No transaction data available.</div>
      ) : (
        <div className="space-y-6">
          {sortedMonths.map(month => {
            const txs = months[month];
            const outTx = txs.filter(t => t.type === 'OUT');
            const inTx = txs.filter(t => t.type === 'IN' || t.type === 'PURCHASE');
            const totalOut = outTx.reduce((s, t) => s + t.value, 0);
            const totalIn = inTx.reduce((s, t) => s + t.value, 0);
            const totalOutQty = outTx.reduce((s, t) => s + t.quantity, 0);
            const totalInQty = inTx.reduce((s, t) => s + t.quantity, 0);

            const d = new Date(month + '-01');
            const label = d.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' });

            // Category breakdown for this month
            const catBreakdown = outTx.reduce<Record<string, { qty: number; val: number }>>((acc, t) => {
              if (!acc[t.category]) acc[t.category] = { qty: 0, val: 0 };
              acc[t.category].qty += t.quantity;
              acc[t.category].val += t.value;
              return acc;
            }, {});

            return (
              <Card key={month} className="overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-extrabold text-gray-900">{label}</span>
                    <Tag text={`${txs.length} transactions`} color="#6366f1" />
                  </div>
                  <div className="flex items-center gap-5 text-xs font-mono">
                    <span className="text-emerald-600 font-bold">+{totalInQty} in ({fmt(totalIn)})</span>
                    <span className="text-red-600 font-bold">-{totalOutQty} out ({fmt(totalOut)})</span>
                  </div>
                </div>

                {/* Summary stats */}
                <div className="grid grid-cols-4 divide-x divide-gray-100 border-b border-gray-100">
                  <div className="p-4 text-center">
                    <div className="text-[11px] text-gray-400 uppercase tracking-wider font-bold">Transactions</div>
                    <div className="text-xl font-extrabold text-gray-900 mt-1">{txs.length}</div>
                  </div>
                  <div className="p-4 text-center">
                    <div className="text-[11px] text-gray-400 uppercase tracking-wider font-bold">Consumed</div>
                    <div className="text-xl font-extrabold text-red-600 mt-1">{totalOutQty}</div>
                  </div>
                  <div className="p-4 text-center">
                    <div className="text-[11px] text-gray-400 uppercase tracking-wider font-bold">Restocked</div>
                    <div className="text-xl font-extrabold text-emerald-600 mt-1">{totalInQty}</div>
                  </div>
                  <div className="p-4 text-center">
                    <div className="text-[11px] text-gray-400 uppercase tracking-wider font-bold">Spend</div>
                    <div className="text-xl font-extrabold text-gray-900 mt-1">{fmt(totalOut)}</div>
                  </div>
                </div>

                {/* Category breakdown */}
                {Object.keys(catBreakdown).length > 0 && (
                  <div className="px-6 py-4">
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Consumption by Category</div>
                    <div className="space-y-2.5">
                      {Object.entries(catBreakdown).sort((a, b) => b[1].val - a[1].val).map(([cat, data]) => {
                        const maxVal = Math.max(...Object.values(catBreakdown).map(d => d.val), 1);
                        return (
                          <div key={cat}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-semibold text-gray-600">{cat}</span>
                              <span className="font-mono font-bold text-gray-800">{data.qty} units &middot; {fmt(data.val)}</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full bg-gray-800 transition-all" style={{ width: `${(data.val / maxVal) * 100}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ===================== MAIN APP =====================

export default function InventoryPage() {
  const [view, setView] = useState<View>('dashboard');
  const [items, setItems] = useState<Item[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(loadData('vigil-inv-items', []));
    setTransactions(loadData('vigil-inv-tx', []));
    setLoaded(true);
  }, []);

  useEffect(() => { if (loaded) saveData('vigil-inv-items', items); }, [items, loaded]);
  useEffect(() => { if (loaded) saveData('vigil-inv-tx', transactions); }, [transactions, loaded]);

  if (!loaded) return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-300 text-sm">Loading...</div></div>;

  const navItems: { id: View; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Overview', icon: '\u25A3' },
    { id: 'scan', label: 'Scan', icon: '\u25CE' },
    { id: 'items', label: 'Register', icon: '\u25A1' },
    { id: 'transactions', label: 'Ledger', icon: '\u2261' },
    { id: 'monthly', label: 'Monthly', icon: '\u25A7' },
    { id: 'add-item', label: 'New Item', icon: '+' },
  ];

  const handleExport = () => {
    const headers = 'Date,Day,Week,Barcode,Item,Category,Type,Qty,Unit Cost,Value\n';
    const rows = transactions.map(t =>
      `${t.date},${t.day},${t.week},${t.barcode},"${t.itemName}",${t.category},${t.type},${t.quantity},${t.unitCost},${t.value}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`; a.click();
  };

  return (
    <div className="min-h-screen pb-24 relative z-10">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div>
          <h1 className="text-lg font-extrabold text-gray-900 tracking-tight">Inventory Management</h1>
          <div className="text-[11px] text-gray-400 font-medium mt-0.5 tracking-wide">
            {items.length} items &middot; {transactions.length} transactions &middot; {new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
        <button onClick={handleExport} className="text-xs font-bold text-gray-500 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-all">
          Export CSV
        </button>
      </header>

      {/* Content */}
      <div className="px-4 md:px-8 py-8 max-w-6xl mx-auto relative z-10">
        {view === 'dashboard' && <DashboardView items={items} transactions={transactions} />}
        {view === 'scan' && <ScanView items={items} transactions={transactions} onTransaction={t => setTransactions(p => [...p, t])} />}
        {view === 'items' && <ItemsView items={items} transactions={transactions} />}
        {view === 'transactions' && <TransactionsView transactions={transactions} />}
        {view === 'monthly' && <MonthlyView transactions={transactions} />}
        {view === 'add-item' && <AddItemView items={items} onAdd={item => setItems(p => [...p, item])} />}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-100 flex justify-around py-2.5 z-20" style={{ paddingBottom: 'max(10px, env(safe-area-inset-bottom))' }}>
        {navItems.map(n => (
          <button
            key={n.id} onClick={() => setView(n.id)}
            className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all ${
              view === n.id ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <span className={`text-lg font-bold ${view === n.id ? 'scale-110' : ''} transition-transform`}>{n.icon}</span>
            <span className={`text-[10px] font-bold tracking-wide ${view === n.id ? 'text-gray-900' : ''}`}>{n.label}</span>
            {view === n.id && <div className="w-1 h-1 rounded-full bg-gray-900 mt-0.5" />}
          </button>
        ))}
      </nav>
    </div>
  );
}
