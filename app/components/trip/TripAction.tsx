"use client";

import { useRouter } from "next/navigation";
import { startTransition, useActionState } from "react";
import { updateTripStatus } from "@/app/actions";
import type { TripStatus } from "@/lib/types";
import { buttonConfig } from "@/app/constants/ui";
import { validationConfig } from "@/app/constants/validation";
import LoadingOverlay from "@/app/components/ui/LoadingOverlay";

const TripAction = ({
  tripId,
  status,
}: {
  tripId: string;
  status: TripStatus;
}) => {
  const router = useRouter();

  const [state, action, pending] = useActionState<{
    error: string | null;
  }>(
    async () => {
      try {
        await updateTripStatus(tripId, status === "want" ? "done" : "want");
        router.refresh();
        return { error: null };
      } catch (e) {
        return {
          error: e instanceof Error ? e.message : validationConfig.createError,
        };
      }
    },
    { error: null },
  );

  const handleStatusToggle = async () => {
    startTransition(() => action());
  };

  return (
    <>
      {state.error && (
        <p className="text-xs text-red-500 mb-3">{state.error}</p>
      )}
      <button
        onClick={handleStatusToggle}
        disabled={pending}
        className="cursor-pointer"
      >
        <span className="absolute top-3 right-3.5 bg-orange-200 text-orange-900 text-xs font-medium px-3 py-1 rounded-full hover:bg-orange-300 duration-300">
          {status === "done" ? buttonConfig.done : buttonConfig.want}
        </span>
      </button>
      <LoadingOverlay visible={pending} />
    </>
  );
};

export default TripAction;
