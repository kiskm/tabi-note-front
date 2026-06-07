"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteSpot } from "@/app/actions";

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
    if (!confirm("このスポットを削除しますか？")) return;
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
      className="ml-auto text-xs text-gray-400 hover:text-red-500 disabled:opacity-50 px-2"
    >
      削除
    </button>
  );
};
