'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createExpense } from '@/app/actions';

const CATEGORIES = [
  { value: 'transport', label: '交通' },
  { value: 'hotel', label: '宿泊' },
  { value: 'food', label: '食事' },
  { value: 'other', label: 'その他' },
];

export default function AddExpenseForm({ tripId }: { tripId: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState('transport');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');

  async function handleSubmit() {
    const num = Number(amount);
    if (!amount) { setError('金額は必須です'); setAmount(''); return; }
    if (num < 0) { setError('金額は0以上で入力してください'); setAmount(''); return; }
    if (num > 9999999) { setError('金額は9,999,999円以下で入力してください'); setAmount(''); return; }
    if (!Number.isInteger(num)) { setError('金額は整数で入力してください'); setAmount(''); return; }
    if (memo.trim().length > 500) { setError('メモは500文字以内で入力してください'); setMemo(''); return; }

    setError(null);
    setPending(true);
    const fd = new FormData();
    fd.append('category', category);
    fd.append('amount', amount);
    if (memo.trim()) fd.append('memo', memo.trim());
    try {
      await createExpense(tripId, fd);
      setOpen(false);
      setCategory('transport');
      setAmount('');
      setMemo('');
      router.refresh();
    } catch {
      setError('追加に失敗しました');
    } finally {
      setPending(false);
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-sm text-blue-600 hover:underline">
        + 支出を追加
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
      <p className="text-sm font-medium text-gray-900">支出を追加</p>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400 bg-white">
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>
      <input type="number" min="0" max="9999999" step="1" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="金額（円） *" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
      <input value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="メモ（任意）" maxLength={500} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
      <div className="flex gap-2">
        <button type="button" onClick={() => { setOpen(false); setError(null); }} className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600">キャンセル</button>
        <button type="button" onClick={handleSubmit} disabled={pending} className="flex-1 py-2 rounded-lg bg-gray-900 text-white text-sm disabled:opacity-50">{pending ? '追加中...' : '追加'}</button>
      </div>
    </div>
  );
}
