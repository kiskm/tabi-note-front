"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteSpot } from "@/app/actions";
import { buttonConfig, confirmConfig } from "@/app/constants/ui";

export const DeleteSpotButton = ({
  spotId,
  tripId,
}: {
  spotId: number;
  tripId: number;
}) => {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleDelete = async () => {
    if (!confirm(confirmConfig.deleteSpot)) return;
    setPending(true);
    try {
      await deleteSpot(spotId, tripId);
      router.refresh();
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="ml-auto px-2 text-xs text-gray-400 hover:text-red-500 disabled:opacity-50 cursor-pointer"
    >
      {buttonConfig.delete}
    </button>
  );
};
