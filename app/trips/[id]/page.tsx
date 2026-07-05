import Link from "next/link";
import { getTrip } from "@/lib/api";
import AddSpotForm from "@/app/components/AddSpotForm";
import AddExpenseForm from "@/app/components/AddExpenseForm";
import { DeleteSpotButton } from "@/app/components/DeleteSpotButton";
import { EditSpotButton } from "@/app/components/EditSpotButton";
import SpotCheckButton from "@/app/components/SpotCheckButton";
import { ExpenseSummary } from "@/app/components/ExpenseSummary";
import { textConfig, titleConfig } from "@/app/constants/ui";
import TripAction from "@/app/components/TripAction";
import { differenceInBusinessDays } from "date-fns";
import { IconMapPinPlus, IconReceipt } from "@tabler/icons-react";
import TripDelete from "@/app/components/TripDelete";

const TripDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const trip = await getTrip(id);

  const dateRange = [trip.startDate, trip.endDate].filter(Boolean).join(" 〜 ");

  let diffDays = "-";
  if (trip.startDate && trip.endDate) {
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    const diffDaysInt = differenceInBusinessDays(endDate, startDate);
    diffDaysInt === 0
      ? (diffDays = "日帰り")
      : (diffDays = diffDaysInt.toLocaleString());
  }

  const total = trip.expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <>
      {/* 外側ラッパー */}
      <div className="bg-stone-50 min-h-screen">
        <div className="max-w-full mx-auto p-4 md:p-5">
          {/* ヘッダー */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
            <span className="font-serif text-xl text-stone-900">
              <Link href="/">{titleConfig.title}</Link>
            </span>
            <span className="text-sm text-stone-400">{trip.userId}</span>
          </div>
          {/* 詳細カード */}
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
            {/* カラーヘッダー */}
            <div className="relative h-auto bg-orange-50 flex items-end px-4 py-3.5">
              <TripAction tripId={trip.id} status={trip.status} />
              <div>
                {/* 旅行タイトル */}
                <div className="font-serif text-xl text-orange-950 leading-tight">
                  {trip.title}
                </div>
                <p>{trip.area}</p>
                <div className="text-sm text-orange-800 mt-0.5">
                  {dateRange}
                </div>
              </div>
            </div>
            {/* 統計バー */}
            <div className="flex border-b border-stone-200">
              <div className="flex-1 text-center py-3.5 px-4 border-r border-stone-200">
                <div className="text-2xl font-medium text-stone-900">
                  {trip.spots.length}
                </div>
                <div className="text-xs text-stone-400 mt-0.5">
                  {textConfig.spot}
                </div>
              </div>
              <div className="flex-1 text-center py-3.5 px-4 border-r border-stone-200">
                <div className="text-2xl font-medium text-stone-900">
                  ¥ {total.toLocaleString()}
                </div>
                <div className="text-xs text-stone-400 mt-0.5">
                  {textConfig.expenses}
                </div>
              </div>
              <div className="flex-1 text-center py-3.5 px-4 border-stone-200">
                <div className="text-2xl font-medium text-stone-900">
                  {diffDays}
                </div>
                <div className="text-xs text-stone-400 mt-0.5">
                  {textConfig.nights}
                </div>
              </div>
            </div>
            {/* スポット */}
            <div className="px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[15px] font-serif font-medium text-stone-900">
                  {textConfig.spot}
                </span>
                {trip.spots.length > 0 && (
                  <span className="text-xs text-stone-400 bg-stone-100 px-2.5 py-0.5 rounded-full">
                    {trip.spots.length}
                  </span>
                )}
              </div>
              {trip.spots.length > 0 ? (
                <>
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
                            <p className="text-xs text-gray-500">
                              {spot.category}
                            </p>
                          )}
                          {spot.memo && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {spot.memo}
                            </p>
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
                  <div className="mt-1">
                    <AddSpotForm tripId={trip.id} />
                  </div>
                </>
              ) : (
                <div
                  className="border border-dashed border-stone-300 rounded-xl
                  py-5 px-4 text-center items-center mb-5"
                >
                  <div className="flex text-orange-600 text-2xl mb-1.5 justify-center">
                    <IconMapPinPlus />
                  </div>
                  <p className="text-sm text-stone-500 mb-3 hidden md:block">
                    {textConfig.noSpotPC}
                  </p>
                  <p className="text-sm text-stone-500 mb-3 md:hidden">
                    {textConfig.noSpotSP}
                  </p>
                  <AddSpotForm tripId={trip.id} />
                </div>
              )}
            </div>
            {/* 費用 */}
            <div className="px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[15px] font-medium font-serif text-stone-900">
                  {textConfig.expenses}
                </span>
                {trip.spots.length > 0 && (
                  <span className="text-xs text-stone-400 bg-stone-100 px-2.5 py-0.5 rounded-full">
                    {trip.expenses.length}
                  </span>
                )}
              </div>
              {trip.expenses.length > 0 ? (
                <>
                  <ExpenseSummary
                    expenses={trip.expenses}
                    budget={trip.budget}
                    tripId={trip.id}
                  />
                  <div className="mt-1">
                    <AddExpenseForm tripId={trip.id} />
                  </div>
                </>
              ) : (
                <div
                  className="border border-dashed border-stone-300 rounded-xl
                  py-5 px-4 text-center items-center mb-5"
                >
                  <div className="flex text-emerald-600 text-2xl mb-1.5 justify-center">
                    <IconReceipt />
                  </div>
                  <p className="text-sm text-stone-500 mb-3">
                    {textConfig.noExpenses}
                  </p>
                  <AddExpenseForm tripId={trip.id} />
                </div>
              )}
            </div>
            <div
              className="flex justify-end px-lg py-3
                border-t border-stone-200 bg-stone-50"
            >
              <TripDelete tripId={trip.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TripDetailPage;
