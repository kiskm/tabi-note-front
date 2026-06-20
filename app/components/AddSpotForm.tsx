"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSpot } from "@/app/actions";
import { validationConfig } from "@/app/constants/validation";
import { spotFormConfig } from "@/app/constants/form";
import { buttonConfig, toggleConfig } from "@/app/constants/ui";
import { CancelButton } from "@/app/components/CancelButton";

const AddSpotForm = ({ tripId }: { tripId: string }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [memo, setMemo] = useState("");

  const handleSubmit = async () => {
    // バリデーション
    if (!name.trim()) {
      setError(validationConfig.spot.spotRequired);
      setName("");
      return;
    }
    if (name.trim().length > 100) {
      setError(validationConfig.spot.spotLength);
      setName("");
      return;
    }
    if (category.trim().length > 50) {
      setError(validationConfig.spot.categoryLength);
      setCategory("");
      return;
    }
    if (memo.trim().length > 500) {
      setError(validationConfig.spot.memoLength);
      setMemo("");
      return;
    }

    setError(null);
    setPending(true);
    const fd = new FormData();
    fd.append("name", name.trim());
    if (category.trim()) fd.append("category", category.trim());
    if (memo.trim()) fd.append("memo", memo.trim());
    try {
      await createSpot(tripId, fd);
      setOpen(false);
      setName("");
      setCategory("");
      setMemo("");
      router.refresh();
    } catch {
      setError(validationConfig.createError);
    } finally {
      setPending(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-3 text-sm text-blue-600 hover:underline cursor-pointer"
      >
        {toggleConfig.addSpot}
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
      <p className="text-sm font-medium text-gray-900">
        {spotFormConfig.addHeading}
      </p>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={spotFormConfig.spotName}
        maxLength={100}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
      />
      <input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder={spotFormConfig.category}
        maxLength={50}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
      />
      <input
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder={spotFormConfig.memo}
        maxLength={500}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
      />
      <div className="flex gap-2">
        <CancelButton
          setEditing={() => setOpen(false)}
          setError={() => setError(null)}
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={pending}
          className="flex-1 py-2 rounded-lg bg-gray-900 text-white text-sm disabled:opacity-50 hover:bg-gray-700 transition-colors duration-300 cursor-pointer"
        >
          {pending ? buttonConfig.addPending : buttonConfig.add}
        </button>
      </div>
    </div>
  );
};

export default AddSpotForm;
