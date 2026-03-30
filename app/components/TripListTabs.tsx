'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Trip } from '@/lib/types';

function TripCard({ trip }: { trip: Trip }) {
  return (
    <Link href={`/trips/${trip.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors cursor-pointer">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-sm font-medium text-gray-900 leading-snug">{trip.title}</h2>
          <span
            className={`text-xs px-2 py-0.5 rounded font-medium ml-2 shrink-0 ${
              trip.status === 'done'
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-50 text-blue-700'
            }`}
          >
            {trip.status === 'done' ? '行った' : '行きたい'}
          </span>
        </div>
        {(trip.area || trip.startDate) && (
          <p className="text-xs text-gray-500 mb-3">
            {[trip.startDate?.slice(0, 7).replace('-', '年') + '月', trip.area]
              .filter(Boolean)
              .join(' · ')}
          </p>
        )}
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full"
            style={{ width: trip.status === 'done' ? '100%' : '0%' }}
          />
        </div>
      </div>
    </Link>
  );
}

export default function TripListTabs({ trips }: { trips: Trip[] }) {
  const [activeTab, setActiveTab] = useState<'want' | 'done'>('want');
  const filtered = trips.filter((t) => t.status === activeTab);

  return (
    <div>
      <div className="flex border-b border-gray-200 mb-4">
        {(['want', 'done'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-500'
            }`}
          >
            {tab === 'want' ? '行きたい' : '行った'}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-12">旅行が登録されていません</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}
