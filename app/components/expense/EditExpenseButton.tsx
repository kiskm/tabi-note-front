"use client";

import { startTransition, useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { updateExpense } from "@/app/actions";
import { validationConfig } from "@/app/constants/validation";
import { CATEGORIES, expenseFormConfig } from "@/app/constants/form";
import { buttonConfig } from "@/app/constants/ui";
import CancelButton from "@/app/components/ui/CancelButton";
import LoadingOverlay from "@/app/components/ui/LoadingOverlay";
import SelectArrow from "@/app/components/ui/SelectArrow";
import type { Participant } from "@/lib/types";

export const EditExpenseButton = ({
  expenseId,
  tripId,
  category,
  amount,
  memo,
  paidByParticipantId,
  splitParticipantIds,
  participants,
}: {
  expenseId: number;
  tripId: string;
  category: string;
  amount: number;
  memo: string | null;
  paidByParticipantId: number | null;
  splitParticipantIds: number[];
  participants: Participant[];
}) => {
  const router = useRouter();
  // 状態管理
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryVal, setCategoryVal] = useState(category);
  const [amountVal, setAmountVal] = useState(String(amount));
  const [memoVal, setMemoVal] = useState(memo ?? "");
  const [paidByVal, setPaidByVal] = useState(
    paidByParticipantId ? String(paidByParticipantId) : "",
  );
  const [splitVal, setSplitVal] = useState(splitParticipantIds);

  const toggleSplitParticipant = (id: number) => {
    setSplitVal((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const [state, action, pending] = useActionState<{
    error: string | null;
  }>(
    async () => {
      try {
        await updateExpense(expenseId, tripId, {
          category: categoryVal,
          amount: Number(amountVal),
          memo: memoVal.trim() || undefined,
          paidByParticipantId: paidByVal ? Number(paidByVal) : undefined,
          splitParticipantIds: splitVal,
        });
        setEditing(false);
        router.refresh();
        return { error: null };
      } catch (e) {
        return {
          error: e instanceof Error ? e.message : validationConfig.saveError,
        };
      }
    },
    { error: null },
  );

  const handleSave = async () => {
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
    if (splitVal.length === 0) {
      setError(validationConfig.expense.splitParticipantsRequired);
      return;
    }

    setError(null);
    startTransition(() => action());
  };

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
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-sm p-6 flex flex-col gap-3">
          <p className="text-sm font-medium text-gray-900">
            {expenseFormConfig.editHeading}
          </p>
          {(error || state.error) && (
            <p className="text-xs text-red-500 mb-3">{error || state.error}</p>
          )}
          <div className="relative">
            <select
              value={categoryVal}
              onChange={(e) => setCategoryVal(e.target.value)}
              className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:border-gray-400 bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <SelectArrow />
          </div>
          <div className="relative">
            <select
              value={paidByVal}
              onChange={(e) => setPaidByVal(e.target.value)}
              className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:border-gray-400 bg-white"
            >
              <option value="">{expenseFormConfig.paidByPlaceholder}</option>
              {participants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <SelectArrow />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-gray-400">
              {expenseFormConfig.splitParticipants}
            </p>
            {participants.map((p) => (
              <label
                key={p.id}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <input
                  type="checkbox"
                  checked={splitVal.includes(p.id)}
                  onChange={() => toggleSplitParticipant(p.id)}
                  className="accent-emerald-600"
                />
                {p.name}
              </label>
            ))}
          </div>
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
      <LoadingOverlay visible={pending} />
    </>
  );
};
