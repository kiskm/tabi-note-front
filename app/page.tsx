import { cookies } from "next/headers";
import { getTrips } from "@/lib/api";
import TripListTabs from "@/app/components/trip/TripListTabs";
import AddTripModal from "@/app/components/trip/AddTripModal";
import { titleConfig } from "@/app/constants/ui";
import { LogoutButton } from "@/app/components/auth/LogoutButton";
import AchievementRateBar from "@/app/components/ui/AchievementRateBar";

const Page = async () => {
  const trips = await getTrips();
  const doneCount = trips.filter((t) => t.status === "done").length;
  const username = (await cookies()).get("username")?.value ?? "";

  return (
    <div className="mx-auto px-4 py-6 md:px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold font-serif text-gray-900">
          {titleConfig.title}
        </h1>
        <div className="flex justify-end">
          <h2 className="text-sm text-gray-500 mt-2.5 mr-3">
            こんにちは、{username}さん
          </h2>
          <div className="mb-4 mr-1 hidden md:block">
            <AddTripModal />
          </div>
          <LogoutButton />
        </div>
      </div>
      <AchievementRateBar doneCount={doneCount} allTrips={trips.length} />
      <TripListTabs trips={trips} />
      <div className="fixed bottom-6 right-6 md:hidden">
        <AddTripModal />
      </div>
    </div>
  );
};

export default Page;
