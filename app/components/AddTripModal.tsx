"use client";

import { useState } from "react";
import { createTrip } from "@/app/actions";
import { validationConfig } from "@/app/constants/validation";
import { tripFormConfig } from "@/app/constants/form";

const AddTripModal = () => {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [area, setArea] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");

  const handleSubmit = async () => {
    // バリデーション
    if (!title.trim()) {
      setError(validationConfig.trip.titleRequired);
      setTitle("");
      return;
    }
    if (title.trim().length > 100) {
      setError(validationConfig.trip.titleLength);
      setTitle("");
      return;
    }
    if (area.trim().length > 100) {
      setError(validationConfig.trip.areaLength);
      setArea("");
      return;
    }
    if (startDate && endDate && endDate < startDate) {
      setError(validationConfig.trip.dateSelect);
      setEndDate("");
      return;
    }
    if (budget) {
      const num = Number(budget);
      if (num < 0) {
        setError(validationConfig.trip.budgetRequired);
        setBudget("");
        return;
      }
      if (num > 9999999) {
        setError(validationConfig.trip.budgetLength);
        setBudget("");
        return;
      }
      if (!Number.isInteger(num)) {
        setError(validationConfig.trip.budgetInteger);
        setBudget("");
        return;
      }
    }

    setError(null);
    setPending(true);
    const fd = new FormData();
    fd.append("title", title.trim());
    if (area.trim()) fd.append("area", area.trim());
    if (startDate) fd.append("startDate", startDate);
    if (endDate) fd.append("endDate", endDate);
    if (budget) fd.append("budget", budget);
    try {
      await createTrip(fd);
      setOpen(false);
      setTitle("");
      setArea("");
      setStartDate("");
      setEndDate("");
      setBudget("");
    } catch {
      setError(validationConfig.createError);
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-xl shadow-md hover:bg-gray-700 transition-colors md:hidden"
      >
        +
      </button>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg py-2 px-3 bg-gray-900 text-gray-100 text-lg font-serif shadow-md hover:bg-gray-700 transition-colors duration-300 cursor-pointer hidden md:block"
      >
        旅行を追加
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              {tripFormConfig.title}
            </h2>
            {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  {tripFormConfig.title}
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={tripFormConfig.tripName}
                  maxLength={100}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  {tripFormConfig.area}
                </label>
                <input
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder={tripFormConfig.area}
                  maxLength={100}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">
                    {tripFormConfig.startDate}
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">
                    {tripFormConfig.endDate}
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
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
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder={tripFormConfig.budget}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                />
              </div>
              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setError(null);
                  }}
                  className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
                >
                  キャンセル
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={pending}
                  className="flex-1 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-700 disabled:opacity-50"
                >
                  {pending ? "追加中..." : "追加"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddTripModal;
