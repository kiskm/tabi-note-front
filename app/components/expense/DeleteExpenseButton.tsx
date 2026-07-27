"use client";

import { useRouter } from "next/navigation";
import { startTransition, useActionState } from "react";
import { deleteExpense } from "@/app/actions";
import { buttonConfig, confirmConfig } from "@/app/constants/ui";
import { validationConfig } from "@/app/constants/validation";
import { SubmitState } from "@/lib/types";
import LoadingOverlay from "@/app/components/ui/LoadingOverlay";

export const DeleteExpenseButton = ({
  expenseId,
  tripId,
}: {
  expenseId: number;
  tripId: string;
}) => {
  const router = useRouter();
  const [state, action, pending] = useActionState<SubmitState>(
    async (_prevState) => {
      try {
        await deleteExpense(expenseId, tripId);
        router.refresh();
        return { error: null };
      } catch (e) {
        return {
          error: e instanceof Error ? e.message : validationConfig.deleteError,
        };
      }
    },
    { error: null },
  );

  const handleDelete = async () => {
    if (!confirm(confirmConfig.deleteExpense)) return;
    startTransition(action);
  };

  return (
    <>
      <button
        onClick={handleDelete}
        disabled={pending}
        className="px-2 text-xs text-gray-400 hover:text-red-500 disabled:opacity-50 cursor-pointer"
      >
        {buttonConfig.delete}
      </button>
      {state.error && <p className="text-xs text-red-500">{state.error}</p>}
      <LoadingOverlay visible={pending} />
    </>
  );
};
