"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteSpot, deleteExpense } from "@/app/actions";

export function DeleteSpotButton({
  spotId,
  tripId,
}: {
  spotId: number;
  tripId: number;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!confirm("このスポットを削除しますか？")) return;
    setPending(true);
    try {
      await deleteSpot(spotId, tripId);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="ml-auto text-xs text-gray-400 hover:text-red-500 disabled:opacity-50 px-2"
    >
      削除
    </button>
  );
}

export function DeleteExpenseButton({
  expenseId,
  tripId,
}: {
  expenseId: number;
  tripId: number;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!confirm("この支出を削除しますか？")) return;
    setPending(true);
    try {
      await deleteExpense(expenseId, tripId);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="text-xs text-gray-400 hover:text-red-500 disabled:opacity-50"
    >
      削除
    </button>
  );
}
