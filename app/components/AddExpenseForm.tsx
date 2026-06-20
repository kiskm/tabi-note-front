"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createExpense } from "@/app/actions";
import { validationConfig } from "@/app/constants/validation";
import { CATEGORIES, expenseFormConfig } from "@/app/constants/form";
import { CancelButton } from "@/app/components/CancelButton";
import { buttonConfig, toggleConfig } from "@/app/constants/ui";

const AddExpenseForm = ({ tripId }: { tripId: string }) => {
  // 状態管理
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("transport");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");

  const handleSubmit = async () => {
    // バリデーション
    const num = Number(amount);
    if (!amount) {
      setError(validationConfig.expense.amountRequired);
      setAmount("");
      return;
    }
    if (num < 0) {
      setError(validationConfig.expense.amountOverZero);
      setAmount("");
      return;
    }
    if (num > 9999999) {
      setError(validationConfig.expense.amountLength);
      setAmount("");
      return;
    }
    if (!Number.isInteger(num)) {
      setError(validationConfig.expense.amountInteger);
      setAmount("");
      return;
    }
    if (memo.trim().length > 500) {
      setError(validationConfig.expense.memoLength);
      setMemo("");
      return;
    }

    setError(null);
    setPending(true);
    const fd = new FormData();
    fd.append("category", category);
    fd.append("amount", amount);
    if (memo.trim()) fd.append("memo", memo.trim());
    try {
      await createExpense(tripId, fd);
      setOpen(false);
      setCategory("transport");
      setAmount("");
      setMemo("");
      router.refresh();
    } catch {
      setError(validationConfig.createError);
    } finally {
      setPending(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-3 text-sm text-blue-600 hover:underline cursor-pointer"
      >
        {toggleConfig.addExpense}
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
      <p className="text-sm font-medium text-gray-900">
        {expenseFormConfig.addHeading}
      </p>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
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
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder={expenseFormConfig.amount}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
      />
      <input
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder={expenseFormConfig.memo}
        maxLength={500}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
      />
      <div className="flex gap-2">
        <CancelButton
          setEditing={() => setOpen(false)}
          setError={() => setError(null)}
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={pending}
          className="flex-1 py-2 rounded-lg bg-gray-900 text-white text-sm disabled:opacity-50 hover:bg-gray-700 transition-colors duration-300 cursor-pointer"
        >
          {pending ? buttonConfig.addPending : buttonConfig.add}
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;
