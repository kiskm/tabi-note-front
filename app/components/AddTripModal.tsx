'use client';

import { useState, useRef } from 'react';
import { createTrip } from '@/app/actions';

export default function AddTripModal() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    try {
      await createTrip(formData);
      setOpen(false);
      formRef.current?.reset();
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
            <form ref={formRef} action={handleSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">タイトル *</label>
                <input
                  name="title"
                  required
                  placeholder="例：京都・奈良 紅葉旅"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">エリア</label>
                <input
                  name="area"
                  placeholder="例：関西"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">開始日</label>
                  <input
                    name="startDate"
                    type="date"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">終了日</label>
                  <input
                    name="endDate"
                    type="date"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">予算（円）</label>
                <input
                  name="budget"
                  type="number"
                  min="0"
                  placeholder="例：60000"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="flex-1 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-700 disabled:opacity-50"
                >
                  {pending ? '追加中...' : '追加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
