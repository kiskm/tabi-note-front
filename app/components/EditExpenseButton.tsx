"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateExpense } from "@/app/actions";

const CATEGORIES = [
  { value: "transport", label: "交通" },
  { value: "hotel", label: "宿泊" },
  { value: "food", label: "食事" },
  { value: "other", label: "その他" },
];

export const EditExpenseButton = ({
  expenseId,
  tripId,
  category,
  amount,
  memo,
}: {
  expenseId: number;
  tripId: number;
  category: string;
  amount: number;
  memo: string | null;
}) => {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryVal, setCategoryVal] = useState(category);
  const [amountVal, setAmountVal] = useState(String(amount));
  const [memoVal, setMemoVal] = useState(memo ?? "");

  async function handleSave() {
    const num = Number(amountVal);

    if (!amountVal) {
      setError("金額は必須です");
      setAmountVal("");
      return;
    }
    if (num < 0) {
      setError("金額は0以上で入力してください");
      setAmountVal("");
      return;
    }
    if (num > 9999999) {
      setError("金額は9,999,999円以下で入力してください");
      setAmountVal("");
      return;
    }
    if (!Number.isInteger(num)) {
      setError("金額は整数で入力してください");
      setAmountVal("");
      return;
    }
    if (memoVal.trim().length > 500) {
      setError("メモは500文字以内で入力してください");
      setMemoVal("");
      return;
    }

    setError(null);
    setPending(true);
    try {
      await updateExpense(expenseId, tripId, {
        category: categoryVal,
        amount: num,
        memo: memoVal.trim() || undefined,
      });
      setEditing(false);
      router.refresh();
    } catch {
      setError("保存に失敗しました");
    } finally {
      setPending(false);
    }
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="text-xs text-gray-400 hover:text-blue-500 px-2 cursor-pointer"
      >
        編集
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 flex flex-col gap-3">
        <p className="text-sm font-medium text-gray-900">支出を編集</p>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <select
          value={categoryVal}
          onChange={(e) => setCategoryVal(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400 bg-white"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="0"
          max="9999999"
          step="1"
          value={amountVal}
          onChange={(e) => setAmountVal(e.target.value)}
          placeholder="金額（円）*"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
        />
        <input
          value={memoVal}
          onChange={(e) => setMemoVal(e.target.value)}
          placeholder="メモ"
          maxLength={500}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setError(null);
            }}
            className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-200 transition-colors duration-300 cursor-pointer"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={pending}
            className="flex-1 py-2 rounded-lg bg-gray-900 text-white text-sm disabled:opacity-50 hover:bg-gray-700 transition-colors duration-300 cursor-pointer"
          >
            {pending ? "保存中..." : "保存"}
          </button>
        </div>
      </div>
    </div>
  );
};
