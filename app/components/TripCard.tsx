"use client";

import Link from "next/link";
import type { Trip } from "@/lib/types";

const TripCard = ({ trip }: { trip: Trip }) => {
  const total = trip.spots.length;
  const checked = trip.spots.filter((s) => s.checked).length;
  const percent = total > 0 ? Math.round((checked / total) * 100) : 0;

  return (
    <Link href={`/trips/${trip.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors duration-300 cursor-pointer">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-sm font-medium text-gray-900 leading-snug">
            {trip.title}
          </h2>
          <span
            className={`text-xs px-2 py-0.5 rounded font-medium ml-2 shrink-0 ${
              trip.status === "done"
                ? "bg-green-100 text-green-800"
                : "bg-blue-50 text-blue-700"
            }`}
          >
            {trip.status === "done" ? "行った" : "行きたい"}
          </span>
        </div>
        {trip.area || trip.startDate ? (
          <p className="text-xs text-gray-500 mb-2">
            {[trip.startDate?.slice(0, 7).replace("-", "年") + "月", trip.area]
              .filter(Boolean)
              .join(" · ")}
          </p>
        ) : (
          <br />
        )}
        {total > 0 ? (
          <p className="text-xs text-gray-400 mb-2">
            スポット {checked}/{total}件チェック済み
          </p>
        ) : (
          <br />
        )}
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </Link>
  );
};

export default TripCard;
