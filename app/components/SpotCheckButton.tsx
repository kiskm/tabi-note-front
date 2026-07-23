"use client";

import { useRouter } from "next/navigation";
import { startTransition, useActionState } from "react";
import { toggleSpotChecked } from "@/app/actions";
import { validationConfig } from "@/app/constants/validation";
import LoadingOverlay from "@/app/components/LoadingOverlay";

const SpotCheckButton = ({
  spotId,
  tripId,
  checked,
}: {
  spotId: number;
  tripId: string;
  checked: boolean;
}) => {
  const router = useRouter();

  const [state, action, pending] = useActionState<{
    error: string | null;
  }>(
    async () => {
      try {
        await toggleSpotChecked(spotId, tripId);
        router.refresh();
        return { error: null };
      } catch {
        return { error: validationConfig.updateError };
      }
    },
    { error: null },
  );

  const handleToggle = async () => {
    startTransition(() => action());
  };

  return (
    <>
      {state.error && (
        <p className="text-xs text-red-500 mb-3">{state.error}</p>
      )}
      <button
        onClick={handleToggle}
        disabled={pending}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors cursor-pointer disabled:opacity-50 ${
          checked
            ? "bg-green-500 border-green-500 text-white"
            : "border-gray-300 text-transparent hover:border-gray-400"
        }`}
      >
        ✓
      </button>
      <LoadingOverlay visible={pending} />
    </>
  );
};

export default SpotCheckButton;
