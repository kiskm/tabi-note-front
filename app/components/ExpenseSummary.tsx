import type { Expense } from "@/lib/types";
import { EditExpenseButton } from "@/app/components/EditExpenseButton";
import { DeleteExpenseButton } from "@/app/components/DeleteExpenseButton";

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

export const ExpenseSummary = ({
  expenses,
  budget,
  tripId,
}: {
  expenses: Expense[];
  budget: number | null;
  tripId: string;
}) => {
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
    <div className="p-4 bg-white rounded-xl border border-gray-200">
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
        <div className="pt-6 pb-2 border-t border-gray-100">
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
        <div className="mt-3 pt-3 pb-1 border-t border-gray-100">
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
};
