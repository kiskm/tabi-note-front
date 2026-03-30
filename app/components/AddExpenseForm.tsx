'use client';

import { useState, useRef } from 'react';
import { createExpense } from '@/app/actions';

const CATEGORIES = [
  { value: 'transport', label: '交通' },
  { value: 'hotel', label: '宿泊' },
  { value: 'food', label: '食事' },
  { value: 'other', label: 'その他' },
];

export default function AddExpenseForm({ tripId }: { tripId: number }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    try {
      await createExpense(tripId, formData);
      setOpen(false);
      formRef.current?.reset();
    } finally {
      setPending(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-blue-600 hover:underline"
      >
        + 支出を追加
      </button>
    );
  }

  return (
    <form ref={formRef} action={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
      <p className="text-sm font-medium text-gray-900">支出を追加</p>
      <select
        name="category"
        required
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400 bg-white"
      >
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>
      <input
        name="amount"
        type="number"
        min="0"
        required
        placeholder="金額（円） *"
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
      />
      <input
        name="memo"
        placeholder="メモ（任意）"
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={pending}
          className="flex-1 py-2 rounded-lg bg-gray-900 text-white text-sm disabled:opacity-50"
        >
          {pending ? '追加中...' : '追加'}
        </button>
      </div>
    </form>
  );
}
