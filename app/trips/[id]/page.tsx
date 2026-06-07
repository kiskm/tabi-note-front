import Link from "next/link";
import { getTrip } from "@/lib/api";
import type { Expense } from "@/lib/types";
import AddSpotForm from "@/app/components/AddSpotForm";
import AddExpenseForm from "@/app/components/AddExpenseForm";
import TripActions from "@/app/components/TripActions";
import {
  DeleteSpotButton,
  DeleteExpenseButton,
} from "@/app/components/DeleteButton";
import { EditSpotButton, EditExpenseButton } from "@/app/components/EditButton";
import SpotCheckButton from "@/app/components/SpotCheckButton";

// 定数の定義
const CATEGORY_LABEL: Record<string, string> = {
  transport: "交通",
  hotel: "宿泊",
  food: "食事",
  other: "その他",
};

// 色の定義
const CATEGORY_COLOR: Record<string, string> = {
  transport: "bg-blue-500",
  hotel: "bg-green-500",
  food: "bg-yellow-400",
  other: "bg-gray-400",
};

const CATEGORY_BAR_COLOR: Record<string, string> = {
  transport: "bg-blue-500",
  hotel: "bg-green-500",
  food: "bg-yellow-400",
  other: "bg-gray-400",
};

function ExpenseSummary({
  expenses,
  budget,
  tripId,
}: {
  expenses: Expense[];
  budget: number | null;
  tripId: number;
}) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const budgetPercent = budget
    ? Math.min(Math.round((total / budget) * 100), 100)
    : null;

  const categoryTotals = (["transport", "hotel", "food", "other"] as const)
    .map((cat) => ({
      key: cat,
      label: CATEGORY_LABEL[cat],
      amount: expenses
        .filter((e) => e.category === cat)
        .reduce((s, e) => s + e.amount, 0),
    }))
    .filter((c) => c.amount > 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex flex-col divide-y divide-gray-100">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="flex justify-between items-center py-2"
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${CATEGORY_COLOR[expense.category] ?? "bg-gray-400"}`}
              />
              <div>
                <span className="text-xs text-gray-500">
                  {CATEGORY_LABEL[expense.category] ?? expense.category}
                </span>
                {expense.memo && (
                  <p className="text-xs text-gray-400">{expense.memo}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">
                ¥{expense.amount.toLocaleString()}
              </span>
              <EditExpenseButton
                expenseId={expense.id}
                tripId={tripId}
                category={expense.category}
                amount={expense.amount}
                memo={expense.memo}
              />
              <DeleteExpenseButton expenseId={expense.id} tripId={tripId} />
            </div>
          </div>
        ))}
      </div>

      {/* カテゴリ別内訳グラフ */}
      {categoryTotals.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex h-3 rounded-full overflow-hidden gap-px">
            {categoryTotals.map((c) => (
              <div
                key={c.key}
                className={`${CATEGORY_BAR_COLOR[c.key]} h-full`}
                style={{ width: `${(c.amount / total) * 100}%` }}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
            {categoryTotals.map((c) => (
              <div key={c.key} className="flex items-center gap-1">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${CATEGORY_BAR_COLOR[c.key]}`}
                />
                <span className="text-xs text-gray-500">
                  {c.label} ¥{c.amount.toLocaleString()} (
                  {Math.round((c.amount / total) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 予算バー */}
      {budget && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>合計 ¥{total.toLocaleString()}</span>
            <span>予算 ¥{budget.toLocaleString()}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${budgetPercent}%` }}
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

  const dateRange = [trip.startDate, trip.endDate].filter(Boolean).join(" 〜 ");

  return (
    <>
      <div className="flex items-center justify-between pb-6 border-b border-b-gray-400">
        <h1 className="px-4 md:px-8 pt-6 text-3xl font-semibold font-serif text-gray-900">
          <Link href="/">旅ノート</Link>
        </h1>
      </div>
      <div className="mx-auto px-4 py-6 md:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold font-serif text-gray-900 mb-1">
            {trip.title}
          </h1>
          <p className="text-sm text-gray-500 mb-3">
            {[dateRange, trip.area].filter(Boolean).join(" · ")}
          </p>
          <TripActions tripId={trip.id} status={trip.status} />
        </div>

        {/* スポット */}
        <div className="mb-4">
          {(() => {
            const checkedCount = trip.spots.filter((s) => s.checked).length;
            return (
              <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                スポット{" "}
                {trip.spots.length > 0
                  ? `${checkedCount}/${trip.spots.length}件 チェック済み`
                  : "(0件)"}
              </h2>
            );
          })()}
          <div className="flex flex-col gap-2 mb-3">
            {trip.spots.map((spot) => (
              <div
                key={spot.id}
                className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3"
              >
                <SpotCheckButton
                  spotId={spot.id}
                  tripId={trip.id}
                  checked={spot.checked}
                />
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${spot.checked ? "text-gray-400 line-through" : "text-gray-900"}`}
                  >
                    {spot.name}
                  </p>
                  {spot.category && (
                    <p className="text-xs text-gray-500">{spot.category}</p>
                  )}
                  {spot.memo && (
                    <p className="text-xs text-gray-400 mt-0.5">{spot.memo}</p>
                  )}
                </div>
                <EditSpotButton
                  spotId={spot.id}
                  tripId={trip.id}
                  name={spot.name}
                  category={spot.category}
                  memo={spot.memo}
                />
                <DeleteSpotButton spotId={spot.id} tripId={trip.id} />
              </div>
            ))}
          </div>
          <AddSpotForm tripId={trip.id} />
        </div>

        {/* 費用 */}
        <div className="mb-4">
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
            費用
          </h2>
          {trip.expenses.length > 0 && (
            <div className="mb-3">
              <ExpenseSummary
                expenses={trip.expenses}
                budget={trip.budget}
                tripId={trip.id}
              />
            </div>
          )}
          <AddExpenseForm tripId={trip.id} />
        </div>
      </div>
    </>
  );
}
