"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateTripStatus, deleteTrip } from "@/app/actions";
import type { TripStatus } from "@/lib/types";
import { buttonConfig, confirmConfig } from "@/app/constants/ui";

const TripActions = ({
  tripId,
  status,
}: {
  tripId: number;
  status: TripStatus;
}) => {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleStatusToggle = async () => {
    setPending(true);
    try {
      await updateTripStatus(tripId, status === "want" ? "done" : "want");
      router.refresh();
    } finally {
      setPending(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(confirmConfig.deleteTrip)) return;
    setPending(true);
    try {
      await deleteTrip(tripId);
      router.push("/");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleStatusToggle}
        disabled={pending}
        className={`text-xs w-20 px-3 py-1.5 rounded-lg font-medium border cursor-pointer transition-colors duration-300 disabled:opacity-50 ${
          status === "done"
            ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
            : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
        }`}
      >
        {status === "done" ? buttonConfig.done : buttonConfig.want}
      </button>
      <button
        onClick={handleDelete}
        disabled={pending}
        className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors duration-300 cursor-pointer"
      >
        {buttonConfig.delete}
      </button>
    </div>
  );
};

export default TripActions;
