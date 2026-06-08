import Link from "next/link";
import { getTrip } from "@/lib/api";
import AddSpotForm from "@/app/components/AddSpotForm";
import AddExpenseForm from "@/app/components/AddExpenseForm";
import TripActions from "@/app/components/TripActions";
import { DeleteSpotButton } from "@/app/components/DeleteSpotButton";
import { EditSpotButton } from "@/app/components/EditSpotButton";
import SpotCheckButton from "@/app/components/SpotCheckButton";
import { ExpenseSummary } from "@/app/components/ExpenseSummary";

const TripDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const trip = await getTrip(Number(id));

  const dateRange = [trip.startDate, trip.endDate].filter(Boolean).join(" 〜 ");

  return (
    <>
      <div className="flex items-center justify-between pb-6 border-b border-b-gray-400">
        <h1 className="px-4 md:px-8 pt-6 text-3xl font-semibold font-serif text-gray-900">
          <Link href="/">旅ノート</Link>
        </h1>
      </div>
      <div className="mx-auto px-4 py-6 md:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold font-serif text-gray-900 mb-1">
            {trip.title}
          </h1>
          <p className="text-sm text-gray-500 mb-3">
            {[dateRange, trip.area].filter(Boolean).join(" · ")}
          </p>
          <TripActions tripId={trip.id} status={trip.status} />
        </div>

        {/* スポット */}
        <div className="mb-4">
          {(() => {
            const checkedCount = trip.spots.filter((s) => s.checked).length;
            return (
              <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                スポット{" "}
                {trip.spots.length > 0
                  ? `${checkedCount}/${trip.spots.length}件 チェック済み`
                  : "(0件)"}
              </h2>
            );
          })()}
          <div className="flex flex-col gap-2">
            {trip.spots.map((spot) => (
              <div
                key={spot.id}
                className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3"
              >
                <SpotCheckButton
                  spotId={spot.id}
                  tripId={trip.id}
                  checked={spot.checked}
                />
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${spot.checked ? "text-gray-400 line-through" : "text-gray-900"}`}
                  >
                    {spot.name}
                  </p>
                  {spot.category && (
                    <p className="text-xs text-gray-500">{spot.category}</p>
                  )}
                  {spot.memo && (
                    <p className="text-xs text-gray-400 mt-0.5">{spot.memo}</p>
                  )}
                </div>
                <EditSpotButton
                  spotId={spot.id}
                  tripId={trip.id}
                  name={spot.name}
                  category={spot.category}
                  memo={spot.memo}
                />
                <DeleteSpotButton spotId={spot.id} tripId={trip.id} />
              </div>
            ))}
          </div>
          <AddSpotForm tripId={trip.id} />
        </div>

        {/* 費用 */}
        <div className="mb-4">
          <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
            費用
          </h2>
          {trip.expenses.length > 0 && (
            <ExpenseSummary
              expenses={trip.expenses}
              budget={trip.budget}
              tripId={trip.id}
            />
          )}
          <AddExpenseForm tripId={trip.id} />
        </div>
      </div>
    </>
  );
};

export default TripDetailPage;
