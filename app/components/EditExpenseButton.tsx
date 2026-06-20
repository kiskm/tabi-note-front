"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateExpense } from "@/app/actions";
import { validationConfig } from "@/app/constants/validation";
import { CATEGORIES, expenseFormConfig } from "@/app/constants/form";
import { CancelButton } from "@/app/components/CancelButton";
import { buttonConfig } from "@/app/constants/ui";

export const EditExpenseButton = ({
  expenseId,
  tripId,
  category,
  amount,
  memo,
}: {
  expenseId: number;
  tripId: string;
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
      setError(validationConfig.expense.amountRequired);
      setAmountVal("");
      return;
    }
    if (num < 0) {
      setError(validationConfig.expense.amountOverZero);
      setAmountVal("");
      return;
    }
    if (num > 9999999) {
      setError(validationConfig.expense.amountLength);
      setAmountVal("");
      return;
    }
    if (!Number.isInteger(num)) {
      setError(validationConfig.expense.amountInteger);
      setAmountVal("");
      return;
    }
    if (memoVal.trim().length > 500) {
      setError(validationConfig.expense.memoLength);
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
      setError(validationConfig.saveError);
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
        {buttonConfig.edit}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 flex flex-col gap-3">
        <p className="text-sm font-medium text-gray-900">
          {expenseFormConfig.editHeading}
        </p>
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
          placeholder={expenseFormConfig.amount}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
        />
        <input
          value={memoVal}
          onChange={(e) => setMemoVal(e.target.value)}
          placeholder={expenseFormConfig.memo}
          maxLength={500}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
        />
        <div className="flex gap-2">
          <CancelButton
            setEditing={() => setEditing(false)}
            setError={() => setError(null)}
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={pending}
            className="flex-1 py-2 rounded-lg bg-gray-900 text-white text-sm disabled:opacity-50 hover:bg-gray-700 transition-colors duration-300 cursor-pointer"
          >
            {pending ? buttonConfig.savePending : buttonConfig.save}
          </button>
        </div>
      </div>
    </div>
  );
};
