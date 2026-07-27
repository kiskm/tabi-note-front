"use client";

import { useRouter } from "next/navigation";
import { startTransition, useActionState } from "react";
import { deleteParticipant } from "@/app/actions";
import { buttonConfig, confirmConfig } from "@/app/constants/ui";
import { validationConfig } from "@/app/constants/validation";
import { SubmitState } from "@/lib/types";
import LoadingOverlay from "@/app/components/LoadingOverlay";

export const DeleteParticipantButton = ({
  participantId,
  tripId,
}: {
  participantId: number;
  tripId: string;
}) => {
  const router = useRouter();
  const [state, action, pending] = useActionState<SubmitState>(
    async (_prevState) => {
      try {
        await deleteParticipant(participantId, tripId);
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

  const handleDelete = () => {
    if (!confirm(confirmConfig.deleteParticipant)) return;
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
      <LoadingOverlay visible={pending} />
    </>
  );
};
