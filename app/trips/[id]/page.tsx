import Link from 'next/link';
import { getTrip } from '@/lib/api';
import type { Expense } from '@/lib/types';

const CATEGORY_LABEL: Record<string, string> = {
  transport: '交通',
  hotel: '宿泊',
  food: '食事',
  other: 'その他',
};

const CATEGORY_COLOR: Record<string, string> = {
  transport: 'bg-blue-500',
  hotel: 'bg-green-500',
  food: 'bg-yellow-400',
  other: 'bg-gray-400',
};

function ExpenseSummary({ expenses, budget }: { expenses: Expense[]; budget: number | null }) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const percent = budget ? Math.min(Math.round((total / budget) * 100), 100) : null;

  const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">費用</h2>
      <div className="flex flex-col gap-0 divide-y divide-gray-100">
        {Object.entries(byCategory).map(([cat, amount]) => (
          <div key={cat} className="flex justify-between items-center py-2">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${CATEGORY_COLOR[cat] ?? 'bg-gray-400'}`} />
              <span className="text-xs text-gray-500">{CATEGORY_LABEL[cat] ?? cat}</span>
            </div>
            <span className="text-sm font-medium text-gray-900">¥{amount.toLocaleString()}</span>
          </div>
        ))}
      </div>
      {budget && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>合計 ¥{total.toLocaleString()}</span>
            <span>予算 ¥{budget.toLocaleString()}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trip = await getTrip(Number(id));

  const dateRange = [trip.startDate, trip.endDate]
    .filter(Boolean)
    .join(' 〜 ');

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <Link href="/" className="text-sm text-blue-600 mb-4 inline-block">
        ← 一覧
      </Link>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">{trip.title}</h1>
        <p className="text-sm text-gray-500">
          {[dateRange, trip.area].filter(Boolean).join(' · ')}
        </p>
      </div>

      {/* スポット */}
      <div className="mb-4">
        <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
          スポット ({trip.spots.length}件)
        </h2>
        {trip.spots.length === 0 ? (
          <p className="text-sm text-gray-400">スポットが登録されていません</p>
        ) : (
          <div className="flex flex-col gap-2">
            {trip.spots.map((spot) => (
              <div
                key={spot.id}
                className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm shrink-0">
                  📍
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{spot.name}</p>
                  {spot.category && (
                    <p className="text-xs text-gray-500">{spot.category}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 費用 */}
      {trip.expenses.length > 0 && (
        <ExpenseSummary expenses={trip.expenses} budget={trip.budget} />
      )}
    </div>
  );
}
