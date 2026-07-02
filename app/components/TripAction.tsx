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
    <button onClick={handleStatusToggle} disabled={pending}>
      {status === "done" ? buttonConfig.done : buttonConfig.want}
    </button>
  );
};

export default TripAction;
