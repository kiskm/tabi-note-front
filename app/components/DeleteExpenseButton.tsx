"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteExpense } from "@/app/actions";

export const DeleteExpenseButton = ({
  expenseId,
  tripId,
}: {
  expenseId: number;
  tripId: number;
}) => {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleDelete = async () => {
    if (!confirm("この支出を削除しますか？")) return;
    setPending(true);
    try {
      await deleteExpense(expenseId, tripId);
      router.refresh();
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="text-xs text-gray-400 hover:text-red-500 disabled:opacity-50"
    >
      削除
    </button>
  );
};
