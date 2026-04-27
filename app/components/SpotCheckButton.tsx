"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toggleSpotChecked } from "@/app/actions";

export default function SpotCheckButton({
  spotId,
  tripId,
  checked,
}: {
  spotId: number;
  tripId: number;
  checked: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleToggle() {
    setPending(true);
    try {
      await toggleSpotChecked(spotId, tripId);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={pending}
      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors disabled:opacity-50 ${
        checked
          ? "bg-green-500 border-green-500 text-white"
          : "border-gray-300 text-transparent hover:border-gray-400"
      }`}
    >
      ✓
    </button>
  );
}
