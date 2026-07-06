"use client";

import { startTransition, useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { updateTrip } from "@/app/actions";
import { validationConfig } from "@/app/constants/validation";
import { tripFormConfig } from "@/app/constants/form";
import { buttonConfig } from "@/app/constants/ui";
import { CancelButton } from "@/app/components/CancelButton";
import { LoadingOverlay } from "@/app/components/LoadingOverlay";
import { TripStatus } from "@/lib/types";

const EditTripButton = ({
  tripId,
  title,
  area,
  startDate,
  endDate,
  budget,
  status,
}: {
  tripId: string;
  title: string;
  area: string | null;
  startDate: string | null;
  endDate: string | null;
  budget: number | null;
  status: TripStatus;
}) => {
  // 状態管理
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [titleVal, setTitleVal] = useState(title);
  const [areaVal, setAreaVal] = useState(area ?? "");
  const [startDateVal, setStartDateVal] = useState(startDate ?? "");
  const [endDateVal, setEndDateVal] = useState(endDate ?? "");
  const budgetString = budget?.toString();
  const [budgetVal, setBudgetVal] = useState(budgetString ?? "");

  const [state, action, pending] = useActionState<{
    error: string | null;
  }>(
    async () => {
      try {
        await updateTrip(tripId, {
          title: titleVal.trim(),
          area: areaVal.trim() || undefined,
          startDate: startDateVal || undefined,
          endDate: endDateVal || undefined,
          budget: Number(budgetVal) || undefined,
          status: status,
        });
        setEditing(false);
        router.refresh();
        return { error: null };
      } catch {
        return { error: validationConfig.updateError };
      }
    },
    { error: null },
  );

  const handleSave = () => {
    // バリデーション
    if (!titleVal.trim()) {
      setError(validationConfig.trip.titleRequired);
      setTitleVal("");
      return;
    }
    if (titleVal.trim().length > 100) {
      setError(validationConfig.trip.titleLength);
      setTitleVal("");
      return;
    }
    if (areaVal.trim().length > 100) {
      setError(validationConfig.trip.areaLength);
      setAreaVal("");
      return;
    }
    if (startDateVal && endDateVal && endDateVal < startDateVal) {
      setError(validationConfig.trip.dateSelect);
      setEndDateVal("");
      return;
    }
    if (budgetVal) {
      const num = Number(budget);
      if (num < 0) {
        setError(validationConfig.trip.budgetRequired);
        setBudgetVal("");
        return;
      }
      if (num > 9999999) {
        setError(validationConfig.trip.budgetLength);
        setBudgetVal("");
        return;
      }
      if (!Number.isInteger(num)) {
        setError(validationConfig.trip.budgetInteger);
        setBudgetVal("");
        return;
      }
    }

    setError(null);
    startTransition(() => action());
  };

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="border border-black text-black
                       px-3 py-1.5 rounded-lg text-sm cursor-pointer hover:bg-gray-100 duration-300"
      >
        {buttonConfig.tripEdit}
      </button>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
        <p className="text-sm font-medium text-gray-900">
          {tripFormConfig.editHeading}
        </p>
        {(error || state.error) && (
          <p className="text-xs text-red-500 mb-3">{error || state.error}</p>
        )}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">
            {tripFormConfig.title}
          </label>
          <input
            value={titleVal}
            onChange={(e) => setTitleVal(e.target.value)}
            placeholder={tripFormConfig.tripName}
            maxLength={100}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">
            {tripFormConfig.areaLabel}
          </label>
          <input
            value={areaVal}
            onChange={(e) => setAreaVal(e.target.value)}
            placeholder={tripFormConfig.area}
            maxLength={100}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">
              {tripFormConfig.startDate}
            </label>
            <input
              type="date"
              value={startDateVal}
              onChange={(e) => setStartDateVal(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">
              {tripFormConfig.endDate}
            </label>
            <input
              type="date"
              value={endDateVal}
              onChange={(e) => setEndDateVal(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">
            {tripFormConfig.budgetLabel}
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={budgetVal}
            onChange={(e) => setBudgetVal(e.target.value)}
            placeholder={tripFormConfig.budget}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
          />
        </div>
        <div className="flex gap-2">
          <CancelButton
            setEditing={() => setEditing(false)}
            setError={() => setError(null)}
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={pending}
            className="flex-1 py-2 rounded-lg bg-gray-900 text-white text-sm disabled:opacity-50 hover:bg-gray-700 transition-colors duration-300 cursor-pointer"
          >
            {pending ? buttonConfig.savePending : buttonConfig.save}
          </button>
        </div>
      </div>
      <LoadingOverlay visible={pending} />
    </>
  );
};

export default EditTripButton;
