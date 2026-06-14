"use client";

import { useState } from "react";
import type { Trip } from "@/lib/types";
import TripCard from "@/app/components/TripCard";

const TripListTabs = ({ trips }: { trips: Trip[] }) => {
  const [activeTab, setActiveTab] = useState<"want" | "done">("want");
  const filtered = trips.filter((t) => t.status === activeTab);

  return (
    <div>
      <div className="flex border-b border-gray-200 mb-4">
        {(["want", "done"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === tab
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-500"
            }`}
          >
            {tab === "want" ? "行きたい" : "行った"}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-12">
          旅行が登録されていません
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filtered.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TripListTabs;
