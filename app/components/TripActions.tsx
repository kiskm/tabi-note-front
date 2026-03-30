'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { updateTripStatus, deleteTrip } from '@/app/actions';
import type { TripStatus } from '@/lib/types';

export default function TripActions({ tripId, status }: { tripId: number; status: TripStatus }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleStatusToggle() {
    setPending(true);
    try {
      await updateTripStatus(tripId, status === 'want' ? 'done' : 'want');
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  async function handleDelete() {
    if (!confirm('この旅行を削除しますか？')) return;
    setPending(true);
    try {
      await deleteTrip(tripId);
      router.push('/');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleStatusToggle}
        disabled={pending}
        className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-colors disabled:opacity-50 ${
          status === 'done'
            ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
            : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
        }`}
      >
        {status === 'done' ? '✓ 行った' : '行きたい'} → 切り替え
      </button>
      <button
        onClick={handleDelete}
        disabled={pending}
        className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        削除
      </button>
    </div>
  );
}
