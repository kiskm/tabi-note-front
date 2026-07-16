import { textConfig } from "@/app/constants/ui";

const AchievementRateBar = ({
  doneCount,
  allTrips,
}: {
  doneCount: number;
  allTrips: number;
}) => {
  const achievementRate = Math.round((doneCount / allTrips) * 100);
  return (
    <div className="px-5 py-5 border-b border-stone-200">
      <div className="flex items-baseline justify-between mb-1.5 text-sm text-stone-500">
        <span className="text-emerald-700 mr-1">
          {textConfig.achievementRate}
        </span>
        <span>
          <span className="text-base font-medium text-stone-900">
            {achievementRate}%
          </span>
          · {doneCount} / {allTrips}件
        </span>
      </div>
      <div className="h-2 bg-orange-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-600 rounded-full"
          style={{ width: achievementRate + "%" }}
        ></div>
      </div>
    </div>
  );
};

export default AchievementRateBar;
