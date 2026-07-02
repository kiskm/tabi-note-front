"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteTrip } from "@/app/actions";
import type { TripStatus } from "@/lib/types";
import { buttonConfig, confirmConfig } from "@/app/constants/ui";

const TripDelete = ({ tripId }: { tripId: string; status: TripStatus }) => {
  const router = useRouter();
  const [pending, setPending] = useState(false);

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
    <button
      onClick={handleDelete}
      disabled={pending}
      className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors duration-300 cursor-pointer"
    >
      {buttonConfig.delete}
    </button>
  );
};

export default TripDelete;
