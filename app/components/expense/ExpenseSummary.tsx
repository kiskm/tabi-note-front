import type { Expense, Participant } from "@/lib/types";
import { EditExpenseButton } from "@/app/components/expense/EditExpenseButton";
import { DeleteExpenseButton } from "@/app/components/expense/DeleteExpenseButton";
import {
  calculateReferencePerPerson,
  calculateSettlement,
} from "@/lib/settlement";

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
  participants,
}: {
  expenses: Expense[];
  budget: number | null;
  tripId: string;
  participants: Participant[];
}) => {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const referencePerPerson = calculateReferencePerPerson(
    expenses,
    participants.length,
  );
  const settlement = calculateSettlement(expenses, participants);
  const participantName = (id: number) =>
    participants.find((p) => p.id === id)?.name ?? "-";
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
          <div key={expense.id} className="flex flex-col gap-1 py-2">
            <div className="flex justify-between items-center">
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
                  paidByParticipantId={expense.paidByParticipantId}
                  splitParticipantIds={expense.splitParticipants.map(
                    (p) => p.id,
                  )}
                  participants={participants}
                />
                <DeleteExpenseButton expenseId={expense.id} tripId={tripId} />
              </div>
            </div>
            <div className="flex justify-between items-center pl-4">
              {expense.paidBy ? (
                <span className="inline-flex items-center gap-1 text-xs text-orange-800 bg-orange-50 border border-orange-200 rounded-full px-2 py-0.5">
                  支払: {expense.paidBy.name}
                </span>
              ) : (
                <span className="text-xs text-gray-400 border border-dashed border-gray-200 rounded-full px-2 py-0.5">
                  未設定
                </span>
              )}
              <span className="text-xs text-gray-500">
                対象:{" "}
                {expense.splitParticipants.length === participants.length
                  ? `全員(${participants.length}人)`
                  : `${expense.splitParticipants.map((p) => p.name).join("・")}(${expense.splitParticipants.length}人)`}
              </span>
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

      {/* 精算 */}
      {participants.length > 0 && (
        <div className="mt-4 pt-4 border-t-2 border-gray-100">
          <p className="text-sm font-medium text-gray-900 mb-2">精算</p>

          <div className="flex justify-between items-center bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
            <span className="text-xs text-amber-800">
              参考: 1人あたり(全額を{participants.length}人で均等割り)
            </span>
            <span className="text-base font-semibold text-amber-800">
              ¥{referencePerPerson.toLocaleString()}
            </span>
          </div>

          {settlement.length > 0 ? (
            <div className="flex flex-col gap-2 mt-3">
              <p className="text-xs text-gray-500">
                実際の精算(費用ごとの対象者を考慮)
              </p>
              {settlement.map((t, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-white border border-gray-200 rounded-xl px-3 py-2"
                >
                  <span className="text-sm text-gray-900">
                    {participantName(t.fromParticipantId)} →{" "}
                    {participantName(t.toParticipantId)}
                  </span>
                  <span className="text-sm font-semibold text-orange-600">
                    ¥{t.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 mt-3">
              精算が必要な費用がまだありません
            </p>
          )}
        </div>
      )}
    </div>
  );
};
