import { getTrips } from "@/lib/api";
import TripListTabs from "./components/TripListTabs";
import AddTripModal from "./components/AddTripModal";

const Page = async () => {
  const trips = await getTrips();
  const doneCount = trips.filter((t) => t.status === "done").length;

  return (
    <div className="mx-auto px-4 py-6 md:px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold font-serif text-gray-900">
          旅ノート
        </h1>
        <span className="text-xs text-gray-500">
          達成率{" "}
          {trips.length > 0 ? Math.round((doneCount / trips.length) * 100) : 0}%
          · {doneCount} / {trips.length}件
        </span>
      </div>
      <div className="flex justify-end">
        <div className="mb-4 mr-1 hidden md:block">
          <AddTripModal />
        </div>
      </div>
      <TripListTabs trips={trips} />
      <div className="fixed bottom-6 right-6 md:hidden">
        <AddTripModal />
      </div>
    </div>
  );
};

export default Page;
