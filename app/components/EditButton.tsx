'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateSpot, updateExpense } from '@/app/actions';

export function EditSpotButton({ spotId, tripId, name, category, memo }: {
  spotId: number;
  tripId: number;
  name: string;
  category: string | null;
  memo: string | null;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);
  const [nameVal, setNameVal] = useState(name);
  const [categoryVal, setCategoryVal] = useState(category ?? '');
  const [memoVal, setMemoVal] = useState(memo ?? '');

  async function handleSave() {
    if (!nameVal.trim()) return;
    setPending(true);
    try {
      await updateSpot(spotId, tripId, {
        name: nameVal.trim(),
        category: categoryVal.trim() || undefined,
        memo: memoVal.trim() || undefined,
      });
      setEditing(false);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="text-xs text-gray-400 hover:text-blue-500 px-2"
      >
        編集
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 flex flex-col gap-3">
        <p className="text-sm font-medium text-gray-900">スポットを編集</p>
        <input value={nameVal} onChange={(e) => setNameVal(e.target.value)} placeholder="スポット名 *" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
        <input value={categoryVal} onChange={(e) => setCategoryVal(e.target.value)} placeholder="カテゴリ" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
        <input value={memoVal} onChange={(e) => setMemoVal(e.target.value)} placeholder="メモ" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
        <div className="flex gap-2">
          <button type="button" onClick={() => setEditing(false)} className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600">キャンセル</button>
          <button type="button" onClick={handleSave} disabled={pending || !nameVal.trim()} className="flex-1 py-2 rounded-lg bg-gray-900 text-white text-sm disabled:opacity-50">{pending ? '保存中...' : '保存'}</button>
        </div>
      </div>
    </div>
  );
}

const CATEGORIES = [
  { value: 'transport', label: '交通' },
  { value: 'hotel', label: '宿泊' },
  { value: 'food', label: '食事' },
  { value: 'other', label: 'その他' },
];

export function EditExpenseButton({ expenseId, tripId, category, amount, memo }: {
  expenseId: number;
  tripId: number;
  category: string;
  amount: number;
  memo: string | null;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);
  const [categoryVal, setCategoryVal] = useState(category);
  const [amountVal, setAmountVal] = useState(String(amount));
  const [memoVal, setMemoVal] = useState(memo ?? '');

  async function handleSave() {
    if (!amountVal || Number(amountVal) <= 0) return;
    setPending(true);
    try {
      await updateExpense(expenseId, tripId, {
        category: categoryVal,
        amount: Number(amountVal),
        memo: memoVal.trim() || undefined,
      });
      setEditing(false);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="text-xs text-gray-400 hover:text-blue-500 px-2"
      >
        編集
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 flex flex-col gap-3">
        <p className="text-sm font-medium text-gray-900">支出を編集</p>
        <select value={categoryVal} onChange={(e) => setCategoryVal(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400 bg-white">
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <input type="number" min="0" value={amountVal} onChange={(e) => setAmountVal(e.target.value)} placeholder="金額（円）*" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
        <input value={memoVal} onChange={(e) => setMemoVal(e.target.value)} placeholder="メモ" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
        <div className="flex gap-2">
          <button type="button" onClick={() => setEditing(false)} className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600">キャンセル</button>
          <button type="button" onClick={handleSave} disabled={pending || !amountVal} className="flex-1 py-2 rounded-lg bg-gray-900 text-white text-sm disabled:opacity-50">{pending ? '保存中...' : '保存'}</button>
        </div>
      </div>
    </div>
  );
}
