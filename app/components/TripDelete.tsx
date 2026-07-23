"use client";

import { useRouter } from "next/navigation";
import { startTransition, useActionState } from "react";
import { deleteTrip } from "@/app/actions";
import { buttonConfig, confirmConfig } from "@/app/constants/ui";
import { SubmitState } from "@/lib/types";
import { validationConfig } from "../constants/validation";
import LoadingOverlay from "@/app/components/LoadingOverlay";

const TripDelete = ({ tripId }: { tripId: string }) => {
  const router = useRouter();
  const [state, action, pending] = useActionState<SubmitState>(
    async (_prevState) => {
      try {
        await deleteTrip(tripId);
        router.push("/");
        return { error: null };
      } catch {
        return { error: validationConfig.deleteError };
      }
    },
    { error: null },
  );

  const handleDelete = () => {
    if (!confirm(confirmConfig.deleteTrip)) return;
    startTransition(action);
  };

  return (
    <>
      <button
        onClick={handleDelete}
        disabled={pending}
        className="text-sm mr-4 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors duration-300 cursor-pointer"
      >
        {buttonConfig.tripDelete}
      </button>
      {state.error && <p className="text-xs text-red-500">{state.error}</p>}
      <LoadingOverlay visible={pending} />
    </>
  );
};

export default TripDelete;
