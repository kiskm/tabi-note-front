'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createSpot } from '@/app/actions';

export default function AddSpotForm({ tripId }: { tripId: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    try {
      await createSpot(tripId, formData);
      setOpen(false);
      formRef.current?.reset();
      router.refresh();
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
        + スポットを追加
      </button>
    );
  }

  return (
    <form ref={formRef} action={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
      <p className="text-sm font-medium text-gray-900">スポットを追加</p>
      <input
        name="name"
        required
        placeholder="スポット名 *"
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
      />
      <input
        name="category"
        placeholder="カテゴリ（例：観光、グルメ）"
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
