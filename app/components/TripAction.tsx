"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateTripStatus } from "@/app/actions";
import type { TripStatus } from "@/lib/types";
import { buttonConfig } from "@/app/constants/ui";

const TripAction = ({
  tripId,
  status,
}: {
  tripId: string;
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

  return (
    <button
      onClick={handleStatusToggle}
      disabled={pending}
      className="cursor-pointer"
    >
      <span className="absolute top-3 right-3.5 bg-orange-200 text-orange-900 text-xs font-medium px-3 py-1 rounded-full hover:bg-orange-300 duration-300">
        {status === "done" ? buttonConfig.done : buttonConfig.want}
      </span>
    </button>
  );
};

export default TripAction;
