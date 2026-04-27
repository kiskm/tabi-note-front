import { getTrips } from "@/lib/api";
import TripListTabs from "./components/TripListTabs";
import AddTripModal from "./components/AddTripModal";

export default async function Page() {
  const trips = await getTrips();
  const doneCount = trips.filter((t) => t.status === "done").length;

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-900">旅ノート</h1>
        <span className="text-xs text-gray-500">
          達成率{" "}
          {trips.length > 0 ? Math.round((doneCount / trips.length) * 100) : 0}%
          · {doneCount} / {trips.length}件
        </span>
      </div>
      <TripListTabs trips={trips} />
      <div className="fixed bottom-6 right-6">
        <AddTripModal />
      </div>
    </div>
  );
}
