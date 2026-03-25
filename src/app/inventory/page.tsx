'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

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

type View = 'dashboard' | 'scan' | 'items' | 'transactions' | 'add-item';

const CATEGORIES = [
  'Food & Beverage', 'Cleaning Supplies', 'Office Supplies', 'Personal Care',
  'Medical', 'Tools & Hardware', 'Packaging', 'Raw Materials', 'Other',
];

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// ===================== HELPERS =====================

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function getWeekNumber(d: Date): string {
  const start = new Date(d.getFullYear(), 0, 1);
  const diff = d.getTime() - start.getTime();
  const oneWeek = 604800000;
  return `W${Math.ceil(diff / oneWeek)}`;
}

function formatCurrency(v: number): string {
  return `$${v.toFixed(2)}`;
}

function getStock(barcode: string, transactions: Transaction[]): number {
  return transactions
    .filter(t => t.barcode === barcode)
    .reduce((sum, t) => {
      if (t.type === 'IN' || t.type === 'PURCHASE') return sum + t.quantity;
      if (t.type === 'OUT') return sum - t.quantity;
      return sum;
    }, 0);
}

// ===================== STORAGE =====================

function loadData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function saveData<T>(key: string, data: T) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// ===================== COMPONENTS =====================

function KPI({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">{label}</div>
      <div className="text-2xl font-bold mt-1" style={{ color: color || '#111' }}>{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  );
}

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider" style={{
      background: `${color}15`, color, border: `1px solid ${color}30`,
    }}>{text}</span>
  );
}

// ===================== DASHBOARD =====================

function DashboardView({ items, transactions }: { items: Item[]; transactions: Transaction[] }) {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const weekTx = transactions.filter(t => new Date(t.date) >= weekStart);
  const weekOut = weekTx.filter(t => t.type === 'OUT');
  const weekIn = weekTx.filter(t => t.type === 'IN' || t.type === 'PURCHASE');

  const totalStockValue = items.reduce((sum, item) => {
    const stock = getStock(item.barcode, transactions);
    return sum + (stock * item.unitCost);
  }, 0);

  const weekConsumptionQty = weekOut.reduce((s, t) => s + t.quantity, 0);
  const weekConsumptionVal = weekOut.reduce((s, t) => s + t.value, 0);
  const weekPurchaseQty = weekIn.reduce((s, t) => s + t.quantity, 0);
  const weekPurchaseVal = weekIn.reduce((s, t) => s + t.value, 0);

  const lowStock = items.filter(item => {
    const stock = getStock(item.barcode, transactions);
    return stock <= item.reorderThreshold && item.active;
  });

  // Usage by category
  const categoryUsage = weekOut.reduce<Record<string, { qty: number; val: number }>>((acc, t) => {
    if (!acc[t.category]) acc[t.category] = { qty: 0, val: 0 };
    acc[t.category].qty += t.quantity;
    acc[t.category].val += t.value;
    return acc;
  }, {});

  // Top consumed items
  const itemUsage = weekOut.reduce<Record<string, number>>((acc, t) => {
    acc[t.itemName] = (acc[t.itemName] || 0) + t.quantity;
    return acc;
  }, {});
  const topItems = Object.entries(itemUsage).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Daily usage this week
  const dailyUsage = DAYS.map((day, i) => {
    const dayDate = new Date(weekStart);
    dayDate.setDate(weekStart.getDate() + i);
    const dayStr = dayDate.toISOString().split('T')[0];
    const qty = weekOut.filter(t => t.date.startsWith(dayStr)).reduce((s, t) => s + t.quantity, 0);
    return { day: day.slice(0, 3), qty };
  });
  const maxDaily = Math.max(...dailyUsage.map(d => d.qty), 1);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Weekly Dashboard</h2>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="Total Stock Value" value={formatCurrency(totalStockValue)} color="#2563eb" />
        <KPI label="Weekly Consumption" value={weekConsumptionQty} sub={formatCurrency(weekConsumptionVal)} color="#f59e0b" />
        <KPI label="Weekly Purchases" value={weekPurchaseQty} sub={formatCurrency(weekPurchaseVal)} color="#10b981" />
        <KPI label="Below Reorder" value={lowStock.length} sub={lowStock.length > 0 ? 'ACTION REQUIRED' : 'All good'} color={lowStock.length > 0 ? '#ef4444' : '#10b981'} />
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="text-sm font-semibold text-red-600 mb-2">Low Stock Alert</div>
          <div className="space-y-1">
            {lowStock.map(item => {
              const stock = getStock(item.barcode, transactions);
              return (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-red-700">{item.name}</span>
                  <span className="font-mono text-red-500">{stock} / {item.reorderThreshold} {item.unit}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily Usage Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="text-sm font-semibold text-gray-700 mb-3">Daily Usage This Week</div>
          <div className="flex items-end gap-2 h-32">
            {dailyUsage.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-[10px] font-mono text-gray-500">{d.qty}</div>
                <div className="w-full rounded-t" style={{
                  height: `${(d.qty / maxDaily) * 100}%`,
                  minHeight: d.qty > 0 ? '4px' : '0',
                  background: 'linear-gradient(180deg, #3b82f6, #2563eb)',
                }} />
                <div className="text-[10px] text-gray-500">{d.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Spend by Category */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="text-sm font-semibold text-gray-700 mb-3">Spend by Category</div>
          {Object.keys(categoryUsage).length === 0 ? (
            <div className="text-sm text-gray-400 text-center py-8">No usage data this week</div>
          ) : (
            <div className="space-y-2">
              {Object.entries(categoryUsage).sort((a, b) => b[1].val - a[1].val).map(([cat, data]) => {
                const maxVal = Math.max(...Object.values(categoryUsage).map(d => d.val), 1);
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-gray-600">{cat}</span>
                      <span className="font-mono text-gray-500">{formatCurrency(data.val)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600" style={{ width: `${(data.val / maxVal) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top 5 Consumed */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="text-sm font-semibold text-gray-700 mb-3">Top 5 Most Consumed</div>
          {topItems.length === 0 ? (
            <div className="text-sm text-gray-400 text-center py-8">No consumption data</div>
          ) : (
            <div className="space-y-2">
              {topItems.map(([name, qty], i) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="flex-1 text-sm text-gray-700">{name}</span>
                  <span className="font-mono text-sm text-gray-500">{qty}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Usage by Category */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="text-sm font-semibold text-gray-700 mb-3">Usage by Category (Qty)</div>
          {Object.keys(categoryUsage).length === 0 ? (
            <div className="text-sm text-gray-400 text-center py-8">No usage data this week</div>
          ) : (
            <div className="space-y-2">
              {Object.entries(categoryUsage).sort((a, b) => b[1].qty - a[1].qty).map(([cat, data]) => (
                <div key={cat} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{cat}</span>
                  <span className="font-mono font-semibold text-gray-700">{data.qty} units</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===================== SCAN VIEW =====================

function ScanView({ items, transactions, onTransaction }: { items: Item[]; transactions: Transaction[]; onTransaction: (t: Transaction) => void }) {
  const [barcode, setBarcode] = useState('');
  const [matched, setMatched] = useState<Item | null>(null);
  const [txType, setTxType] = useState<'IN' | 'OUT' | 'PURCHASE'>('OUT');
  const [qty, setQty] = useState(1);
  const [feedback, setFeedback] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleBarcode = useCallback((code: string) => {
    const item = items.find(i => i.barcode === code);
    if (item) {
      setMatched(item);
      setFeedback('');
    } else {
      setMatched(null);
      setFeedback(`No item found for barcode: ${code}`);
    }
  }, [items]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && barcode.trim()) {
      handleBarcode(barcode.trim());
    }
  };

  const handleSubmit = () => {
    if (!matched) return;
    const stock = getStock(matched.barcode, transactions);
    if (txType === 'OUT' && stock < qty) {
      setFeedback(`Cannot remove ${qty} — only ${stock} in stock`);
      return;
    }

    const now = new Date();
    const tx: Transaction = {
      id: generateId(),
      date: now.toISOString(),
      day: DAYS[now.getDay()],
      week: getWeekNumber(now),
      barcode: matched.barcode,
      itemName: matched.name,
      category: matched.category,
      type: txType,
      quantity: qty,
      unitCost: matched.unitCost,
      value: qty * matched.unitCost,
    };

    onTransaction(tx);
    setFeedback(`${txType === 'OUT' ? 'Removed' : 'Added'} ${qty}x ${matched.name}`);
    setBarcode('');
    setMatched(null);
    setQty(1);
    inputRef.current?.focus();
  };

  const currentStock = matched ? getStock(matched.barcode, transactions) : 0;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h2 className="text-xl font-bold">Scan & Record</h2>

      {/* Barcode input */}
      <div className="bg-white rounded-xl border-2 border-blue-200 p-6 shadow-sm">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Scan Barcode</label>
        <input
          ref={inputRef}
          type="text"
          value={barcode}
          onChange={e => setBarcode(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Scan or type barcode..."
          className="w-full text-2xl font-mono text-center py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          autoFocus
        />
        <p className="text-xs text-gray-400 text-center mt-2">Scanner will auto-submit on Enter</p>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`p-3 rounded-lg text-sm font-medium text-center ${feedback.includes('Cannot') || feedback.includes('No item') ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
          {feedback}
        </div>
      )}

      {/* Matched item */}
      {matched && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold">{matched.name}</div>
              <div className="text-sm text-gray-500">{matched.category} | {matched.barcode}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold font-mono" style={{ color: currentStock <= matched.reorderThreshold ? '#ef4444' : '#10b981' }}>
                {currentStock}
              </div>
              <div className="text-xs text-gray-500">in stock ({matched.unit})</div>
            </div>
          </div>

          {/* Transaction type */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Type</label>
            <div className="flex gap-2">
              {(['OUT', 'IN', 'PURCHASE'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setTxType(type)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    txType === type
                      ? type === 'OUT' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type === 'OUT' ? 'Use / Remove' : type === 'IN' ? 'Restock' : 'Purchase'}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Quantity</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-12 h-12 rounded-lg bg-gray-100 hover:bg-gray-200 text-xl font-bold">-</button>
              <input
                type="number"
                value={qty}
                onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="flex-1 text-center text-2xl font-mono py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={() => setQty(qty + 1)} className="w-12 h-12 rounded-lg bg-gray-100 hover:bg-gray-200 text-xl font-bold">+</button>
            </div>
          </div>

          {/* Value preview */}
          <div className="flex justify-between text-sm p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-500">Transaction Value</span>
            <span className="font-mono font-semibold">{formatCurrency(qty * matched.unitCost)}</span>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className={`w-full py-3.5 rounded-lg text-white font-bold text-lg transition-all ${
              txType === 'OUT' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {txType === 'OUT' ? `Remove ${qty}x ${matched.name}` : `Add ${qty}x ${matched.name}`}
          </button>
        </div>
      )}
    </div>
  );
}

// ===================== ITEMS VIEW =====================

function ItemsView({ items, transactions }: { items: Item[]; transactions: Transaction[] }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Inventory Items ({items.length})</h2>
      {items.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No items yet. Add your first item to get started.</div>
      ) : (
        <div className="grid gap-3">
          {items.map(item => {
            const stock = getStock(item.barcode, transactions);
            const isLow = stock <= item.reorderThreshold;
            return (
              <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">{item.name}</span>
                    <Badge text={item.category} color="#6366f1" />
                    {isLow && <Badge text="REORDER" color="#ef4444" />}
                    {!item.active && <Badge text="INACTIVE" color="#9ca3af" />}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 font-mono">{item.barcode} | {formatCurrency(item.unitCost)}/{item.unit} | Reorder @ {item.reorderThreshold}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold font-mono" style={{ color: isLow ? '#ef4444' : '#10b981' }}>{stock}</div>
                  <div className="text-[10px] text-gray-500 uppercase">{item.unit}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ===================== ADD ITEM VIEW =====================

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
    e.preventDefault();
    setError('');
    if (!name || !barcode || !unitCost) { setError('Name, barcode, and unit cost are required'); return; }
    if (items.some(i => i.barcode === barcode)) { setError('Barcode already exists'); return; }

    const item: Item = {
      id: generateId(),
      name, category, barcode,
      unitCost: parseFloat(unitCost),
      reorderThreshold: parseInt(reorder) || 5,
      unit, active: true,
      createdAt: new Date().toISOString(),
    };
    onAdd(item);
    setSuccess(`Added: ${name}`);
    setName(''); setBarcode(''); setUnitCost(''); setReorder('5');
    barcodeRef.current?.focus();
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h2 className="text-xl font-bold">Add New Item</h2>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}
      {success && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">{success}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Barcode *</label>
          <input ref={barcodeRef} type="text" value={barcode} onChange={e => setBarcode(e.target.value)} placeholder="Scan or type barcode"
            className="w-full py-2.5 px-3 border border-gray-300 rounded-lg text-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" autoFocus />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Item Name *</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Paper Towels"
            className="w-full py-2.5 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="w-full py-2.5 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Unit</label>
            <select value={unit} onChange={e => setUnit(e.target.value)}
              className="w-full py-2.5 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              {['units', 'kg', 'litres', 'packs', 'boxes', 'rolls', 'bottles', 'cans', 'bags', 'pairs'].map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Unit Cost ($) *</label>
            <input type="number" step="0.01" value={unitCost} onChange={e => setUnitCost(e.target.value)} placeholder="0.00"
              className="w-full py-2.5 px-3 border border-gray-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Reorder Threshold</label>
            <input type="number" value={reorder} onChange={e => setReorder(e.target.value)} placeholder="5"
              className="w-full py-2.5 px-3 border border-gray-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all">
          Add Item
        </button>
      </form>
    </div>
  );
}

// ===================== TRANSACTIONS VIEW =====================

function TransactionsView({ transactions }: { transactions: Transaction[] }) {
  const sorted = [...transactions].reverse();
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Transaction Log ({transactions.length})</h2>
      {sorted.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No transactions recorded yet.</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3 text-right">Qty</th>
                  <th className="px-4 py-3 text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sorted.slice(0, 50).map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 text-gray-600 whitespace-nowrap">{new Date(t.date).toLocaleString('en-AU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="px-4 py-2.5">
                      <div className="font-medium text-gray-800">{t.itemName}</div>
                      <div className="text-xs text-gray-400">{t.category}</div>
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge text={t.type} color={t.type === 'OUT' ? '#ef4444' : '#10b981'} />
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono">{t.type === 'OUT' ? '-' : '+'}{t.quantity}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{formatCurrency(t.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ===================== EXPORT =====================

function ExportButton({ items, transactions }: { items: Item[]; transactions: Transaction[] }) {
  const handleExport = () => {
    const headers = 'Date,Day,Week,Barcode,Item,Category,Type,Qty,Unit Cost,Value\n';
    const rows = transactions.map(t =>
      `${t.date},${t.day},${t.week},${t.barcode},"${t.itemName}",${t.category},${t.type},${t.quantity},${t.unitCost},${t.value}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleExport} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
      Export CSV
    </button>
  );
}

// ===================== MAIN APP =====================

export default function InventoryPage() {
  const [view, setView] = useState<View>('dashboard');
  const [items, setItems] = useState<Item[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    setItems(loadData('vigil-inv-items', []));
    setTransactions(loadData('vigil-inv-tx', []));
    setLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!loaded) return;
    saveData('vigil-inv-items', items);
  }, [items, loaded]);

  useEffect(() => {
    if (!loaded) return;
    saveData('vigil-inv-tx', transactions);
  }, [transactions, loaded]);

  const addItem = (item: Item) => setItems(prev => [...prev, item]);
  const addTransaction = (tx: Transaction) => setTransactions(prev => [...prev, tx]);

  if (!loaded) return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>;

  const navItems: { id: View; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '\uD83D\uDCCA' },
    { id: 'scan', label: 'Scan', icon: '\uD83D\uDCF7' },
    { id: 'items', label: 'Items', icon: '\uD83D\uDCE6' },
    { id: 'transactions', label: 'Log', icon: '\uD83D\uDCDD' },
    { id: 'add-item', label: 'Add Item', icon: '\u2795' },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Inventory Tracker</h1>
          <div className="text-xs text-gray-400">{items.length} items | {transactions.length} transactions</div>
        </div>
        <ExportButton items={items} transactions={transactions} />
      </header>

      {/* Content */}
      <div className="px-4 py-6 max-w-5xl mx-auto">
        {view === 'dashboard' && <DashboardView items={items} transactions={transactions} />}
        {view === 'scan' && <ScanView items={items} transactions={transactions} onTransaction={addTransaction} />}
        {view === 'items' && <ItemsView items={items} transactions={transactions} />}
        {view === 'transactions' && <TransactionsView transactions={transactions} />}
        {view === 'add-item' && <AddItemView items={items} onAdd={addItem} />}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 z-20 safe-area-pb">
        {navItems.map(n => (
          <button
            key={n.id}
            onClick={() => setView(n.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all ${
              view === n.id ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <span className="text-lg">{n.icon}</span>
            <span className="text-[10px] font-medium">{n.label}</span>
          </button>
        ))}
      </nav>

      <style jsx>{`
        .safe-area-pb { padding-bottom: max(8px, env(safe-area-inset-bottom)); }
      `}</style>
    </div>
  );
}
