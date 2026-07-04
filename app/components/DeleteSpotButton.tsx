"use client";

import { useRouter } from "next/navigation";
import { startTransition, useActionState } from "react";
import { deleteSpot } from "@/app/actions";
import { buttonConfig, confirmConfig } from "@/app/constants/ui";
import { validationConfig } from "../constants/validation";

type DeleteState = { error: string | null };

export const DeleteSpotButton = ({
  spotId,
  tripId,
}: {
  spotId: number;
  tripId: string;
}) => {
  const router = useRouter();
  const [state, action, pending] = useActionState<DeleteState>(
    async (_prevState) => {
      try {
        await deleteSpot(spotId, tripId);
        router.refresh();
        return { error: null };
      } catch {
        return { error: validationConfig.spot.deleteError };
      }
    },
    { error: null },
  );

  const handleDelete = () => {
    if (!confirm(confirmConfig.deleteSpot)) return;
    startTransition(action);
  };

  return (
    <>
      <button
        onClick={handleDelete}
        disabled={pending}
        className="ml-auto px-2 text-xs text-gray-400 hover:text-red-500 disabled:opacity-50 cursor-pointer"
      >
        {buttonConfig.delete}
      </button>
      {state.error && <p className="text-xs text-red-500">{state.error}</p>}
    </>
  );
};
