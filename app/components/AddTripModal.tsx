'use client';

import { useState } from 'react';
import { createTrip } from '@/app/actions';

export default function AddTripModal() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [area, setArea] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');

  async function handleSubmit() {
    if (!title.trim()) { setError('タイトルは必須です'); setTitle(''); return; }
    if (title.trim().length > 100) { setError('タイトルは100文字以内で入力してください'); setTitle(''); return; }
    if (area.trim().length > 100) { setError('エリアは100文字以内で入力してください'); setArea(''); return; }
    if (startDate && endDate && endDate < startDate) { setError('終了日は開始日以降の日付を入力してください'); setEndDate(''); return; }
    if (budget) {
      const num = Number(budget);
      if (num < 0) { setError('予算は0以上で入力してください'); setBudget(''); return; }
      if (num > 9999999) { setError('予算は9,999,999円以下で入力してください'); setBudget(''); return; }
      if (!Number.isInteger(num)) { setError('予算は整数で入力してください'); setBudget(''); return; }
    }

    setError(null);
    setPending(true);
    const fd = new FormData();
    fd.append('title', title.trim());
    if (area.trim()) fd.append('area', area.trim());
    if (startDate) fd.append('startDate', startDate);
    if (endDate) fd.append('endDate', endDate);
    if (budget) fd.append('budget', budget);
    try {
      await createTrip(fd);
      setOpen(false);
      setTitle('');
      setArea('');
      setStartDate('');
      setEndDate('');
      setBudget('');
    } catch {
      setError('追加に失敗しました');
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-xl shadow-md hover:bg-gray-700 transition-colors"
      >
        +
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">旅行を追加</h2>
            {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">タイトル *</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例：京都・奈良 紅葉旅" maxLength={100} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">エリア</label>
                <input value={area} onChange={(e) => setArea(e.target.value)} placeholder="例：関西" maxLength={100} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">開始日</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">終了日</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">予算（円）</label>
                <input type="number" min="0" step="1" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="例：60000" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div className="flex gap-2 mt-1">
                <button type="button" onClick={() => { setOpen(false); setError(null); }} className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">キャンセル</button>
                <button type="button" onClick={handleSubmit} disabled={pending} className="flex-1 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-700 disabled:opacity-50">{pending ? '追加中...' : '追加'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
